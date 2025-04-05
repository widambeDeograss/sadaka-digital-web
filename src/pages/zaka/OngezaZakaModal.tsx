import { useState } from "react";
import { Button, Modal, Tabs, message, Spin, Descriptions } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPayTypes, postSpRevenue, postZaka, resolveBahasha } from "../../helpers/ApiConnectors";
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


const OngezaZaka = ({ openModal, handleCancel }: ModalProps) => {
  const church = useAppSelector((state: any) => state.sp);
  const user = useAppSelector((state: any) => state.user.userInfo);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [bahashaData, setBahashaData] = useState<any>(null);
  const [verifyingBahasha, setVerifyingBahasha] = useState<boolean>(false);
  const [bahashaError, setBahashaError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);


  // Fetch Payment Types based on church ID
  const { data: payTypes } = useQuery({
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
    date: Yup.date()
      .typeError("Date is invalid")
      .required("Date is required"),
      date_received: Yup.date()
      .typeError("Date is invalid")
      .required("Date is required"),
    payment_type: Yup.number()
      .typeError("Payment type must be a number")
      .required("Payment type is required"),
    remark: Yup.string().optional(),
  };

  // Validation schema for the "Muumini" tab (with card number)
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

  // Mutation for posting Zaka
  const { mutate: postZakaMutation, isPending: posting } = useMutation({
    mutationFn: async (data: any) => {
      const response:any = await postZaka(data);
      const revenueData:RevenuePostRequest = {
        amount: data.zaka_amount,
        church: church?.id,
        payment_type: data.payment_type,
        revenue_type_record: response?.id,
        date_received: data.date_received,
        created_by: user?.username,
        updated_by: user?.username,
        revenue_type: "Zaka"
      }
      const revenueResponse = await postSpRevenue(revenueData);
      return revenueResponse;
    },
    onSuccess: () => {
      dispatch(
        addAlert({
          title: "Success",
          message: "Zaka added successfully!",
          type: "success",
        })
      );
      message.success("Zaka added successfully!");
      handleCancel();
      queryClient.invalidateQueries({queryKey:['zaka']});
      formWithCard.reset();
      formWithoutCard.reset();
      setBahashaData(null);
      setShowConfirmModal(false);
      setBahashaError(null);
    },
    onError: (_error: any) => {
      dispatch(
        addAlert({
          title: "Error",
          message: "Failed to add Zaka.",
          type: "error",
        })
      );
      message.error("Failed to add Zaka.");
    },
    onSettled: () => {
      setShowConfirmModal(false);
      setPendingData(null);
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

  // Unified submit handler
  const onSubmit = (data: any, hasCard: boolean) => {
    console.log("==================================");
    
    // Format date to YYYY-MM-DD
    if (data.date) {
      const localDate = new Date(data.date);
      const localDateR = new Date(data.date_received);
      const formattedDate = localDate.toLocaleDateString("en-CA"); 
      data.date = formattedDate;
      data.date_received = localDateR.toLocaleDateString("en-CA");
    }

    // Prepare final data
    const finalData = {
      collected_by: data.remark,
      zaka_amount: data.amount,
      bahasha: hasCard ? (bahashaData ? bahashaData.id : null) : null,
      church: church?.id,
      payment_type: data.payment_type,
      date: data.date,
      date_received:data.date_received,
      inserted_by: user?.username,
      updated_by: user?.username,
    };
    setPendingData(finalData);
    setShowConfirmModal(true);
    // postZakaMutation(finalData);
  };

  const handleConfirmSubmit = () => {
    if (pendingData) {
      postZakaMutation(pendingData);
    }
  };

  return (
  <>
    <Modal
      title="Ongeza Zaka"
      open={openModal}
      onCancel={handleCancel}
      footer={null}
      width={700}
    >
      <Tabs defaultActiveKey="1" centered>
        {/* Tab for "Muumini" (with card number) */}
        <TabPane tab="Muumini" key="1">
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
                    Bahasha imefanikiwa kupatikana. Name: {bahashaData?.mhumini_details?.first_name} {bahashaData?.mhumini_details?.last_name}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formWithCard.formState.errors.amount ? "border-red-500" : "border-gray-300"
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
                <label htmlFor="payment_type" className="block text-sm font-medium text-gray-700">
                  Malipo
                </label>
                <select
                  id="payment_type"
                  {...formWithCard.register("payment_type")}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md bg-blue-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formWithCard.formState.errors.payment_type ? "border-red-500" : "border-gray-300"
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
                  Tarehe ya mwezi wa zaka
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


              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Tarehe 
                </label>
                <input
                  id="date_received"
                  type="date"
                  max={new Date().toISOString().split('T')[0]} 
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formWithCard.formState.errors.date_received ? "border-red-500" : "border-gray-300"
                  }`}
                  {...formWithCard.register("date_received")}
                />
                {formWithCard.formState.errors.date_received && (
                  <p className="mt-1 text-sm text-red-600">
                    {formWithCard.formState.errors.date_received.message}
                  </p>
                )}
              </div>

              {/* Remark */}
              <div className="col-span-2">
                <label htmlFor="remark" className="block text-sm font-medium text-gray-700">
                  Maelezo
                </label>
                <textarea
                  id="remark"
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  {...formWithCard.register("remark")}
                />
              </div>
            </div>
            <div className="mt-4">
              <Button type="primary" htmlType="submit" loading={posting}
                   className="font-bold bg-[#152033] text-white mt-4"
                   style={{ width: "100%" }}
              >
                Ongeza
              </Button>
            </div>
          </form>
        </TabPane>

        {/* Tab for "Bila Namba ya Kadi" (without card number) */}
        <TabPane tab="Bila Namba ya Kadi" key="2" disabled>
        <form onSubmit={formWithCard.handleSubmit((data) => onSubmit(data, true))}>
            <div className="grid grid-cols-2 gap-4">
              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formWithoutCard.formState.errors.amount ? "border-red-500" : "border-gray-300"
                  }`}
                  {...formWithoutCard.register("amount")}
                />
                {formWithoutCard.formState.errors.amount && (
                  <p className="mt-1 text-sm text-red-600">
                    {formWithoutCard.formState.errors.amount.message}
                  </p>
                )}
              </div>

              {/* Payment Type */}
              <div>
                <label htmlFor="payment_type" className="block text-sm font-medium text-gray-700">
                  Malipo
                </label>
                <select
                  id="payment_type"
                  {...formWithoutCard.register("payment_type")}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md bg-blue-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formWithoutCard.formState.errors.payment_type ? "border-red-500" : "border-gray-300"
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

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Tarehe ya mwezi za zaka
                </label>
                <input
                  id="date"
                  type="date"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formWithoutCard.formState.errors.date ? "border-red-500" : "border-gray-300"
                  }`}
                  {...formWithoutCard.register("date")}
                />
                {formWithoutCard.formState.errors.date && (
                  <p className="mt-1 text-sm text-red-600">
                    {formWithoutCard.formState.errors.date.message}
                  </p>
                )}
              </div>

                    {/* Date */}
                    <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Tarehe 
                </label>
                <input
                  id="date_received"
                  type="date"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formWithCard.formState.errors.date_received ? "border-red-500" : "border-gray-300"
                  }`}
                  {...formWithCard.register("date_received")}
                />
                {formWithCard.formState.errors.date_received && (
                  <p className="mt-1 text-sm text-red-600">
                    {formWithCard.formState.errors.date_received.message}
                  </p>
                )}
              </div>

              {/* Remark */}
              <div className="col-span-2">
                <label htmlFor="remark" className="block text-sm font-medium text-gray-700">
                  Maelezo
                </label>
                <textarea
                  id="remark"
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  {...formWithoutCard.register("remark")}
                />
              </div>
            </div>
            <div className="mt-4">
              <Button type="primary" htmlType="submit" loading={posting}      className="font-bold bg-[#152033] text-white mt-4"
              
              style={{ width: "100%" }} >
                Ongeza
              </Button>
            </div>
          </form>
        </TabPane>
      </Tabs>

   
    </Modal>
    <Modal
        title="Thibitisha Taarifa"
        open={showConfirmModal}
        onOk={handleConfirmSubmit}
        onCancel={() => setShowConfirmModal(false)}
        okText="Thibitisha"
        cancelText="Rudi"
        okButtonProps={{ className: "bg-[#152033] text-white" }}
        confirmLoading={posting}
      >
        {pendingData && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Kiasi">
            Tsh. {pendingData.zaka_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Descriptions.Item>
            {pendingData.bahasha && bahashaData && (
              <Descriptions.Item label="BAHASHA">
                {bahashaData?.card_no}
              </Descriptions.Item>
            )}
        
            <Descriptions.Item label="Aina ya Malipo">
              {payTypes?.find((py: any) => py.id === pendingData.payment_type)?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Tarehe ya Mwezi wa Zaka">
              {pendingData.date}
            </Descriptions.Item>
            <Descriptions.Item label="Tarehe">
              {pendingData.date_received}
            </Descriptions.Item>
            {pendingData.bahasha && bahashaData && (
              <Descriptions.Item label="Jumuiya">
                {bahashaData?.mhumini_details?.jumuiya_details?.name}
              </Descriptions.Item>
            )}
            {pendingData.bahasha && bahashaData && (
              <Descriptions.Item label="Jina la Mhumini">
                {bahashaData.mhumini_details?.first_name}{" "}
                {bahashaData.mhumini_details?.last_name}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
  </>
  );
};

export default OngezaZaka;
