import { useState } from "react";
import { Button, Modal, Tabs, message, Spin } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPayTypes,
  postSadaka,
  postSpRevenue,
  resolveBahasha,
} from "../../helpers/ApiConnectors";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { addAlert } from "../../store/slices/alert/alertSlice";

const { TabPane } = Tabs;

type ModalProps = {
  openModal: boolean;
  handleCancel: () => void;
};


type RevenuePostRequest = {
  amount: string;
  church: number; 
  payment_type: number; 
  revenue_type: string;
  revenue_type_record: string;
  date_received: string;
  created_by: string;
  updated_by: string;
};


const OngezaSadaka = ({ openModal, handleCancel }: ModalProps) => {
  const queryClient = useQueryClient();
  const church = useAppSelector((state: any) => state.sp);
  const user = useAppSelector((state: any) => state.user.userInfo);
  const dispatch = useAppDispatch();

  const [bahashaData, setBahashaData] = useState<any>(null);
  const [verifyingBahasha, setVerifyingBahasha] = useState<boolean>(false);
  const [bahashaError, setBahashaError] = useState<string | null>(null);

  // Fetch Payment Types based on church ID
  const { data: payTypes, isLoading: payTypesLoading } = useQuery({
    queryKey: ["payTypes", church.id],
    queryFn: async () => {
      const response: any = await fetchPayTypes(`?church_id=${church.id}`);
      return response;
    },
  });

  // Base validation schema for common fields
  const baseSchema = {
    amount: Yup.number()
      .typeError("Amount must be a number")
      .required("Amount is required")
      .positive("Amount must be positive"),
    date: Yup.date().typeError("Date is invalid").required("Date is required"),
    payment_type: Yup.number()
      .typeError("Payment type must be a number")
      .required("Payment type is required"),
    remark: Yup.string().optional(),
  };

  // Validation schema for the "Muhumini" tab (with card number)
  const validationSchemaWithCard = Yup.object().shape({
    ...baseSchema,
    cardNumber: Yup.string().required("Card number is required"),
  });

  // Validation schema for the "Bila Namba ya Kadi" tab (without card number)
  const validationSchemaWithoutCard = Yup.object().shape({
    ...baseSchema,
  });

  // Initialize react-hook-form for both tabs
  const formWithCard = useForm({
    resolver: yupResolver(validationSchemaWithCard),
  });

  const formWithoutCard = useForm({
    resolver: yupResolver(validationSchemaWithoutCard),
  });

  // Mutation for posting Sadaka
  const { mutate: postSadakaMutation, isPending: posting } = useMutation({
    mutationFn: async (data: any) => {
      const response:any = await postSadaka(data);
      const revenueData:RevenuePostRequest = {
        amount: data.sadaka_amount,
        church: church?.id,
        payment_type: data.payment_type,
        revenue_type_record: response?.id,
        date_received: data.date,
        created_by: user?.username,
        updated_by: user?.username,
        revenue_type: "Sadaka"
      }
      const revenueResponse = await postSpRevenue(revenueData);
      return revenueResponse;
    },
    onSuccess: () => {
      dispatch(
        addAlert({
          title: "Success",
          message: "Sadaka added successfully!",
          type: "success",
        })
      );
      message.success("Sadaka added successfully!");
      queryClient.invalidateQueries({ queryKey: ["sadaka", "sadaka_totals"] });
      handleCancel();
      formWithCard.reset();
      formWithoutCard.reset();
      setBahashaData(null);
      setBahashaError(null);
    },
    onError: (error: any) => {
      dispatch(
        addAlert({
          title: "Error",
          message: "Failed to add Sadaka.",
          type: "error",
        })
      );
      message.error("Failed to add Sadaka.");
    },
  });

  // Handler to resolve Bahasha (card number)
  const handleResolveBahasha = async (no: string) => {
    if (!no) {
      setBahashaError(null);
      setBahashaData(null);
      return;
    }

    try {
      setVerifyingBahasha(true);
      setBahashaError(null);
      const response: any = await resolveBahasha(no);
      if (response.bahasha_type === "zaka") {
        dispatch(
          addAlert({
            title: "Bahasha Yenye Namba Hii",
            message: "Bahasha hii ni ya Zaka.",
            type: "warning",
          })
        );
        setBahashaError("Bahasha hii ni ya Zaka.");
        setBahashaData(null);
      } else {
        setBahashaData(response);
      }
    } catch (error: any) {
      setBahashaError("Hamna Bahasha yenye namba hii.");
      dispatch(
        addAlert({
          title: "Error",
          message: "Hamna Bahasha yenye namba hii.",
          type: "error",
        })
      );
      setBahashaData(null);
    } finally {
      setVerifyingBahasha(false);
    }
  };

  // Unified submit handler
  const onSubmit = (data: any, hasCard: boolean) => {
    console.log(data.date);
    
    // Format date to YYYY-MM-DD
    if (data.date) {
      const localDate = new Date(data.date);
  const formattedDate = localDate.toLocaleDateString("en-CA"); 
  data.date = formattedDate;
    }

    // Prepare final data
    const finalData = {
      collected_by: data.remark,
      sadaka_amount: data.amount,
      bahasha: hasCard ? (bahashaData ? bahashaData.id : null) : null,
      church: church?.id,
      payment_type: data.payment_type,
      date: data.date,
      inserted_by: user?.username,
      updated_by: user?.username,
    };


    postSadakaMutation(finalData);
  };

  return (
    <Modal
      title="Ongeza Sadaka"
      open={openModal}
      onCancel={handleCancel}
      footer={null}
      width={700}
    >
      <Tabs defaultActiveKey="1" centered>
        {/* Tab for "Muhumini" (with card number) */}
        <TabPane tab="Muhumini" key="1">
          <form
            onSubmit={formWithCard.handleSubmit((data) => onSubmit(data, true))}
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Card Number */}
              <div className="col-span-2">
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Namba ya Kadi
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    bahashaError ? "border-red-500" : "border-gray-300"
                  }`}
                  {...formWithCard.register("cardNumber")}
                  onBlur={(e) => handleResolveBahasha(e.target.value)}
                />
                {verifyingBahasha && (
                  <div className="mt-1">
                    <Spin size="small" /> Inakagua...
                  </div>
                )}
                {bahashaError && (
                  <p className="mt-1 text-sm text-red-600">{bahashaError}</p>
                )}
                {bahashaData && (
                  <p className="mt-1 text-sm text-green-600">
                    Bahasha imefanikiwa kupatikana.
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formWithCard.formState.errors.amount
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  {...formWithCard.register("amount")}
                />
                {formWithCard.formState.errors.amount && (
                  <p className="mt-1 text-sm text-red-600">
                    {formWithCard.formState.errors.amount.message}
                  </p>
                )}
              </div>

              {/* Payment Type */}
              <div>
                <label
                  htmlFor="payment_type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Malipo
                </label>
                <select
                  id="payment_type"
                  {...formWithCard.register("payment_type")}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md bg-blue-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formWithCard.formState.errors.payment_type
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Chagua Aina ya Malipo</option>
                  {payTypes?.map((py: any) => (
                    <option key={py.id} value={py.id}>
                      {py.name}
                    </option>
                  ))}
                </select>
                {formWithCard.formState.errors.payment_type && (
                  <p className="mt-1 text-sm text-red-600">
                    {formWithCard.formState.errors.payment_type.message}
                  </p>
                )}
              </div>

               {/* Date */}
               <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formWithCard.formState.errors.date ? "border-red-500" : "border-gray-300"
                  }`}
                  {...formWithCard.register("date")}
                />
                {formWithCard.formState.errors.date && (
                  <p className="mt-1 text-sm text-red-600">
                    {formWithCard.formState.errors.date.message}
                  </p>
                )}
              </div>

              {/* Remark */}
              <div className="col-span-2">
                <label
                  htmlFor="remark"
                  className="block text-sm font-medium text-gray-700"
                >
                  Remark
                </label>
                <input
                  id="remark"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formWithCard.formState.errors.remark
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  {...formWithCard.register("remark")}
                />
                {formWithCard.formState.errors.remark && (
                  <p className="mt-1 text-sm text-red-600">
                    {formWithCard.formState.errors.remark.message}
                  </p>
                )}
              </div>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className="font-bold bg-[#152033] text-white mt-4"
              style={{ width: "100%" }}
              loading={posting}
            >
              Ongeza Sadaka
            </Button>
          </form>
        </TabPane>

        {/* Tab for "Bila Namba ya Kadi" (without card number) */}
        <TabPane tab="Bila Namba ya Kadi" key="2">
          <form
            onSubmit={formWithoutCard.handleSubmit((data) =>
              onSubmit(data, false)
            )}
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Amount */}
              <div>
                <label
                  htmlFor="amountWithoutCard"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount
                </label>
                <input
                  id="amountWithoutCard"
                  type="number"
                  step="0.01"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formWithoutCard.formState.errors.amount
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  {...formWithoutCard.register("amount")}
                />
                {formWithoutCard.formState.errors.amount && (
                  <p className="mt-1 text-sm text-red-600">
                    {formWithoutCard.formState.errors.amount.message}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="dateWithoutCard"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  id="dateWithoutCard"
                  type="date"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formWithoutCard.formState.errors.date
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  {...formWithoutCard.register("date")}
                />
                {formWithoutCard.formState.errors.date && (
                  <p className="mt-1 text-sm text-red-600">
                    {formWithoutCard.formState.errors.date.message}
                  </p>
                )}
              </div>

              {/* Payment Type */}
              <div>
                <label
                  htmlFor="payment_type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Malipo
                </label>
                <select
                  id="payment_type"
                  {...formWithoutCard.register("payment_type")}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md bg-blue-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formWithoutCard.formState.errors.payment_type
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Chagua Aina ya Malipo</option>
                  {payTypes?.map((py: any) => (
                    <option key={py.id} value={py.id}>
                      {py.name}
                    </option>
                  ))}
                </select>
                {formWithoutCard.formState.errors.payment_type && (
                  <p className="mt-1 text-sm text-red-600">
                    {formWithoutCard.formState.errors.payment_type.message}
                  </p>
                )}
              </div>

              {/* Remark */}
              <div className="col-span-2">
                <label
                  htmlFor="remarkWithoutCard"
                  className="block text-sm font-medium text-gray-700"
                >
                  Remark
                </label>
                <input
                  id="remarkWithoutCard"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formWithoutCard.formState.errors.remark
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  {...formWithoutCard.register("remark")}
                />
                {formWithoutCard.formState.errors.remark && (
                  <p className="mt-1 text-sm text-red-600">
                    {formWithoutCard.formState.errors.remark.message}
                  </p>
                )}
              </div>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className="font-bold bg-[#152033] text-white mt-4"
              style={{ width: "100%" }}
              loading={posting}
            >
              Ongeza Sadaka
            </Button>
          </form>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default OngezaSadaka;
