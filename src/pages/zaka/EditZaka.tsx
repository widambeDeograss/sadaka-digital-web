import { useState, useEffect } from "react";
import { Button, Modal, Tabs, message, Spin } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPayTypes, updateZaka, resolveBahasha, postSpRevenueUpdate } from "../../helpers/ApiConnectors";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { addAlert } from "../../store/slices/alert/alertSlice";

const { TabPane } = Tabs;

type ModalProps = {
  openModal: boolean;
  handleCancel: () => void;
  zakaDetails: any | null; // Add zakaId prop to identify the Zaka being edited
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

const EditZaka = ({ openModal, handleCancel, zakaDetails }: ModalProps) => {
  const church = useAppSelector((state: any) => state.sp);
  const user = useAppSelector((state: any) => state.user.userInfo);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [bahashaData, setBahashaData] = useState<any>(null);
  const [verifyingBahasha, setVerifyingBahasha] = useState<boolean>(false);
  const [bahashaError, setBahashaError] = useState<string | null>(null);

  // Fetch Payment Types
  const { data: payTypes } = useQuery({
    queryKey: ["payTypes", church.id],
    queryFn: async () => {
      const response: any = await fetchPayTypes(`?church_id=${church.id}`);
      return response;
    },
  });


  // Base validation schema
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

  // Prepopulate form with fetched data when editing
  useEffect(() => {
    if (zakaDetails) {
      const formData = {
        amount: zakaDetails.zaka_amount,
        date: zakaDetails.date,
        payment_type: zakaDetails.payment_type,
        remark: zakaDetails.collected_by,
        cardNumber: zakaDetails?.bahasha?.card_no,
      };

      formWithCard.reset(formData);
      formWithoutCard.reset(formData);
      setBahashaData(zakaDetails.bahasha || null);
    }
  }, [zakaDetails, formWithCard, formWithoutCard]);

  // Mutation for updating Zaka
  const { mutate: updateZakaMutation, isPending: updating } = useMutation({
    mutationFn: async (data: any) => {
      const revenueData:RevenuePostRequest = {
        amount: data.zaka_amount,
        church: church?.id,
        payment_type: data.payment_type,
        revenue_type_record: zakaDetails?.id,
        date_received: data.date,
        created_by: user?.username,
        updated_by: user?.username,
        revenue_type: "Zaka"
      }
      const revenueResponse = await postSpRevenueUpdate(revenueData);
      console.log(revenueResponse);
      
      const response = await updateZaka(`${zakaDetails?.id}`, data);
      return response;
    },
    onSuccess: () => {
      dispatch(
        addAlert({
          title: "Success",
          message: "Zaka updated successfully!",
          type: "success",
        })
      );
      message.success("Zaka updated successfully!");
      handleCancel();
      queryClient.invalidateQueries({ queryKey: ["zaka"] });
      formWithCard.reset();
      formWithoutCard.reset();
      setBahashaData(null);
      setBahashaError(null);
    },
    onError: (_error: any) => {
      dispatch(
        addAlert({
          title: "Error",
          message: "Failed to update Zaka.",
          type: "error",
        })
      );
      message.error("Failed to update Zaka.");
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
      const response: any = await resolveBahasha(`${no}/?church_id=${church.id}`);
      if (response.bahasha_type === "sadaka") {
        dispatch(
          addAlert({
            title: "Bahasha Yenye Namba Hii",
            message: "Bahasha hii ni ya Sadaka.",
            type: "warning",
          })
        );
        setBahashaError("Bahasha hii ni ya Sadaka.");
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

  // Unified submit handler for updating Zaka
  const onSubmit = (data: any, hasCard: boolean) => {
    if (data.date) {
      const localDate = new Date(data.date);
      const formattedDate = localDate.toLocaleDateString("en-CA"); 
      data.date = formattedDate;
      }
    const finalData = {
      collected_by: data.remark,
      zaka_amount: data.amount,
      bahasha: hasCard ? (bahashaData ? bahashaData.id : null) : null,
      church: church?.id,
      payment_type: data.payment_type,
      date: data.date,
      inserted_by: user?.username,
      updated_by: user?.username,
    };

    updateZakaMutation(finalData);
  };

  return (
    <Modal
      title="Update"
      open={openModal}
      onCancel={handleCancel}
      footer={null}
      width={700}
    >
      <Tabs defaultActiveKey="1" centered>
        {/* Tab for "Muhumini" (with card number) */}
        <TabPane tab="Muhumini" key="1">
          <form onSubmit={formWithCard.handleSubmit((data) => onSubmit(data, true))}>
            <div className="grid grid-cols-2 gap-4">
              {/* Card Number */}
              <div className="col-span-2">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Kiasi
                </label>
                <input
                  id="amount"
                  type="number"
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  {...formWithCard.register("amount")}
                />
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Tarehe
                </label>
                <input
                  id="date"
                  type="date"
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  {...formWithCard.register("date")}
                />
              </div>

              {/* Payment Type */}
              <div>
                <label htmlFor="payment_type" className="block text-sm font-medium text-gray-700">
                  Njia ya Malipo
                </label>
                <select
                  id="payment_type"
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  {...formWithCard.register("payment_type")}
                >
                  <option value="">Chagua Njia</option>
                  {payTypes?.map((payType: any) => (
                    <option key={payType.id} value={payType.id}>
                      {payType.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remarks */}
              <div>
                <label htmlFor="remark" className="block text-sm font-medium text-gray-700">
                  Aliyeweka
                </label>
                <input
                  id="remark"
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  {...formWithCard.register("remark")}
                />
              </div>
            </div>

            <div className="mt-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={updating}
                block
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {updating ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </TabPane>

        {/* Tab for "Bila Namba ya Kadi" (without card number) */}
        <TabPane tab="Bila Namba ya Kadi" key="2">
          <form
            onSubmit={formWithoutCard.handleSubmit((data) => onSubmit(data, false))}
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Kiasi
                </label>
                <input
                  id="amount"
                  type="number"
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  {...formWithoutCard.register("amount")}
                />
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Tarehe
                </label>
                <input
                  id="date"
                  type="date"
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  {...formWithoutCard.register("date")}
                />
              </div>

              {/* Payment Type */}
              <div>
                <label htmlFor="payment_type" className="block text-sm font-medium text-gray-700">
                  Njia ya Malipo
                </label>
                <select
                  id="payment_type"
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  {...formWithoutCard.register("payment_type")}
                >
                  <option value="">Chagua Njia</option>
                  {payTypes?.map((payType: any) => (
                    <option key={payType.id} value={payType.id}>
                      {payType.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remarks */}
              <div>
                <label htmlFor="remark" className="block text-sm font-medium text-gray-700">
                  Aliyeweka
                </label>
                <input
                  id="remark"
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  {...formWithoutCard.register("remark")}
                />
              </div>
            </div>

            <div className="mt-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={updating}
                block
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {updating ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default EditZaka;
