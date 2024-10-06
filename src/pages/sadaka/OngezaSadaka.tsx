import { useState } from "react";
import { Button, Modal, Tabs, message } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchPayTypes, postSadaka } from "../../helpers/ApiConnectors";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { addAlert } from "../../store/slices/alert/alertSlice";



const OngezaSadaka = ({ openModal, handleCancel }:any) => {
  const church = useAppSelector((state: any) => state.sp);
  const user = useAppSelector((state: any) => state.user.userInfo);
  const dispatch = useAppDispatch();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const {
    data: payTypes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["payTypes"],
    queryFn: async () => {
      const response: any = await fetchPayTypes(`?church_id=${church.id}`);
      console.log(response);
      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  const validationSchemaWithCard = Yup.object().shape({
    cardNumber: Yup.string().required("Card number is required"),
    amount: Yup.number().required("Amount is required").positive(),
    date: Yup.date().required("Date is required"),
    payment_type: Yup.number().required("Type is required"),
    remark: Yup.string().optional(),
  });

  const validationSchemaWithoutCard = Yup.object().shape({
    amount: Yup.number().required("Amount is required").positive(),
    date: Yup.date().required("Date is required"),
    remark: Yup.string().optional(),
  });

  const {
    register: registerWithCard,
    handleSubmit: handleSubmitWithCard,
    formState: { errors: errorsWithCard },
  } = useForm({
    resolver: yupResolver(validationSchemaWithCard),
  });

  const {
    register: registerWithoutCard,
    handleSubmit: handleSubmitWithoutCard,
    formState: { errors: errorsWithoutCard },
  } = useForm({
    resolver: yupResolver(validationSchemaWithoutCard),
  });
 

  // API mutation using React Query
  const { mutate: postPaymentTypeMutation, isPending: posting } = useMutation({
    mutationFn: async (data) => {
      const response = await postSadaka(data);
      return response;
    },
    onSuccess: () => {
      dispatch(
        addAlert({
          title: "Success",
          message: "Sadaka added successfully!",
          type: "success",
        })
      );
      handleCancel();

    },
    onError: (error) => {
      dispatch(
        addAlert({
          title: "Error",
          message: "Failed to add Sadaka.",
          type: "error",
        })
      );
    },
  });

  // Form submit handler
  const onSubmit = (data: any) => {
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    if (data.date) {
      const formattedDate = new Date(data.date).toISOString().split('T')[0];
      data.date = formattedDate;
    }
    const finalData = {
      ...data,
      collected_by:data.remark,
      sadaka_amount:data.amount,
      bahasha:data.cardNumber,
      church: church?.id, 
      inserted_by: user?.username,
      updated_by: user?.username,
    };
    postPaymentTypeMutation(finalData); 
  };

  return (
    <Modal
      title={"Ongeza Sadaka"}
      open={openModal}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={null}
    >
      <Tabs defaultActiveKey="1" centered>
        <Tabs.TabPane tab="Muhumini" key="1">
          <form onSubmit={handleSubmitWithCard(onSubmit)}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                  Namba ya kadi
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errorsWithCard.cardNumber ? "border-red-500" : "border-gray-300"}`}
                  {...registerWithCard("cardNumber")}
                />
                {errorsWithCard.cardNumber && (
                  <p className="mt-1 text-sm text-red-600">{errorsWithCard.cardNumber.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errorsWithCard.amount ? "border-red-500" : "border-gray-300"}`}
                  {...registerWithCard("amount")}
                />
                {errorsWithCard.amount && (
                  <p className="mt-1 text-sm text-red-600">{errorsWithCard.amount.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errorsWithCard.date ? "border-red-500" : "border-gray-300"}`}
                  {...registerWithCard("date")}
                />
                {errorsWithCard.date && (
                  <p className="mt-1 text-sm text-red-600">{errorsWithCard.date.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="remark" className="block text-sm font-medium text-gray-700">
                  Remark
                </label>
                <input
                  id="remark"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errorsWithCard.remark ? "border-red-500" : "border-gray-300"}`}
                  {...registerWithCard("remark")}
                />
                {errorsWithCard.remark && (
                  <p className="mt-1 text-sm text-red-600">{errorsWithCard.remark.message}</p>
                )}
              </div>
              <div>
              <label htmlFor="payment_type" className="block text-sm font-medium text-gray-700">
                Malipo
              </label>
              <select
                id="payment_type"
                {...registerWithCard("payment_type")}
                className={`mt-1 block w-full px-3 py-2 border rounded-md bg-blue-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errorsWithCard.payment_type ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Chagua Aina ya malipo</option>
                {
                  payTypes?.map((py:any) =>  {
                    return <option value={py.id}>{py.name}</option>
                  })
                }
              
              </select>
              {errorsWithCard.payment_type && <p className="text-sm text-red-600">{errorsWithCard.payment_type.message}</p>}
            </div>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className="font-bold bg-[#152033] text-white mt-3"
              style={{ width: "100%" }}
              loading={posting}
            >
              Ongeza Sadaka
            </Button>
          </form>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Bila namba ya kadi" key="2">
          <form onSubmit={handleSubmitWithoutCard(onSubmit)}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="amountWithoutCard" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  id="amountWithoutCard"
                  type="number"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errorsWithoutCard.amount ? "border-red-500" : "border-gray-300"}`}
                  {...registerWithoutCard("amount")}
                />
                {errorsWithoutCard.amount && (
                  <p className="mt-1 text-sm text-red-600">{errorsWithoutCard.amount.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="dateWithoutCard" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  id="dateWithoutCard"
                  type="date"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errorsWithoutCard.date ? "border-red-500" : "border-gray-300"}`}
                  {...registerWithoutCard("date")}
                />
                {errorsWithoutCard.date && (
                  <p className="mt-1 text-sm text-red-600">{errorsWithoutCard.date.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="remarkWithoutCard" className="block text-sm font-medium text-gray-700">
                  Remark
                </label>
                <input
                  id="remarkWithoutCard"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errorsWithoutCard.remark ? "border-red-500" : "border-gray-300"}`}
                  {...registerWithoutCard("remark")}
                />
                {errorsWithoutCard.remark && (
                  <p className="mt-1 text-sm text-red-600">{errorsWithoutCard.remark.message}</p>
                )}
              </div>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className="font-bold bg-[#152033] text-white"
              style={{ width: "100%" }}
              loading={posting}
            >
              Ongeza Sadaka
            </Button>
          </form>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default OngezaSadaka;
