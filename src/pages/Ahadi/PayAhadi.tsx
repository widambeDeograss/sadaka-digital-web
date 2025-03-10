// src/components/PaymentAhadi.tsx

import React, { useEffect } from "react";
import {
  Modal,
  InputNumber,
  Select,
  Button,
  Spin,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
// import { makePayment } from "../../helpers/ApiConnectors";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { addAlert } from "../../store/slices/alert/alertSlice";
import { fetchPayTypes, postAhadiPayment } from "../../helpers/ApiConnectors";

const { Option } = Select;

interface PaymentAhadiProps {
  openModal: boolean;
  handleCancel: () => void;
  ahadiId: any;
}

interface PaymentFormData {
  paymentType: string;
  amount: number;
}
const paymentSchema = yup.object().shape({
  paymentType: yup
    .string()
    .required("Chagua aina ya malipo"),
  amount: yup
    .number()
    .typeError("Kiasi lazima kiwe namba")
    .positive("Kiasi lazima kiwe chanya")
    .required("Ingiza kiasi"),
});

const PaymentAhadi: React.FC<PaymentAhadiProps> = ({
  openModal,
  handleCancel,
  ahadiId,
}) => {
  const dispatch = useAppDispatch();
  const church = useAppSelector((state: any) => state.sp);
  const user = useAppSelector((state: any) => state.user.userInfo);

    // Fetch Payment Types based on church ID
    const { data: payTypes, isLoading: payTypesLoading } = useQuery({
        queryKey: ["payTypes", church.id],
        queryFn: async () => {
          const response: any = await fetchPayTypes(`?church_id=${church.id}`);
          return response;
        },
      });

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: yupResolver(paymentSchema),
  });

  // Mutation for processing payment
  const { mutate: payAhadi, isPending:isLoading } = useMutation({
    mutationFn: async (data: any) => {
      const response:any = await postAhadiPayment(data);
      // const revenueResponse = await postSpRevenue(revenueData);
      return response;
    },
    onSuccess: () => {
      dispatch(
        addAlert({
          title: "Mafanikio",
          message: "Malipo yamefanyika kwa mafanikio!",
          type: "success",
        })
      );
      reset();
      handleCancel();
    },
    onError: (error: any) => {
      dispatch(
        addAlert({
          title: "Hitilafu",
          message:
            error?.response?.data?.detail ||
            "Imeshindikana kufanya malipo. Tafadhali jaribu tena.",
          type: "error",
        })
      );
    },
  });

  // Handle form submission
  const onSubmit = (data: PaymentFormData) => {
    const paymentData = {
      ahadi: ahadiId?.id,
      payment_type: data.paymentType,
      mhumini:ahadiId?.mhumini_details?.id,
      amount: data.amount,
      inserted_by: user?.username,
      updated_by: user?.username,
    };

    payAhadi(paymentData);
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!openModal) {
      reset();
    }
  }, [openModal, reset]);

  return (
    <Modal
      title="Lipa Ahadi"
      open={openModal}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      width={500}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Payment Type Select Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Aina ya Malipo
          </label>
          {payTypesLoading ? (
                <Spin />
              ) : (
                <Controller
                  name="paymentType"
                  control={control}
                  defaultValue={undefined}
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch
                      placeholder="Chagua aina ya malipo"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option?.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      className="w-full"
                      notFoundContent="Haijapatikana"
                    >
                      {payTypes?.map((py: any) => (
                        <Option key={py.id} value={py.id}>
                      {py.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              )}
          {errors.paymentType && (
            <p className="text-sm text-red-600">{errors.paymentType.message}</p>
          )}
        </div>

        {/* Amount Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Kiasi cha Malipo (Tzs)
          </label>
          <Controller
            name="amount"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <InputNumber
                {...field}
                style={{ width: "100%" }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value ? parseFloat(value.replace(/\$\s?|(,*)/g, '')) : 0}
                min={0}
                placeholder="Ingiza kiasi cha malipo"
              />
            )}
          />
          {errors.amount && (
            <p className="text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="primary"
          htmlType="submit"
          className="bg-[#152033]"
          loading={isLoading}
          block
        >
          Lipa Ahadi
        </Button>
      </form>
    </Modal>
  );
};

export default PaymentAhadi;
