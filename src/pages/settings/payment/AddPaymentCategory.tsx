import React from "react";
import { Modal, Button, Input } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query"; // React Query for handling API calls
import { postPayType } from "../../../helpers/ApiConnectors"; // Custom API function for posting payment type
import { useAppDispatch, useAppSelector } from "../../../store/store-hooks";
import { addAlert } from "../../../store/slices/alert/alertSlice";
import { toast } from "react-toastify";

// Yup validation schema
const schema = yup.object().shape({
  name: yup.string().required("Payment type name is required"),
  description: yup.string(),
});

const PaymentTypeModal = ({ visible, onClose }: any) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const church = useAppSelector((state: any) => state.sp);
  const user = useAppSelector((state: any) => state.user.userInfo);
  const dispatch = useAppDispatch();

  // API mutation using React Query
  const { mutate: postPaymentTypeMutation, isPending: posting } = useMutation({
    mutationFn: async (data) => {
      const response = await postPayType(data);
      return response;
    },
    onSuccess: () => {
      dispatch(
        addAlert({
          title: "Success",
          message: "Payment Type added successfully!",
          type: "success",
        })
      );
      onClose();
      reset(); // Reset form after submission
    },
    onError: (error) => {
      toast.error("Failed to add payment type. Please try again.");
      dispatch(
        addAlert({
          title: "Error",
          message: "Failed to add payment type.",
          type: "error",
        })
      );
    },
  });

  // Form submit handler
  const onSubmit = (data: any) => {
    const finalData = {
      ...data,
      church: church?.id, 
      created_by: user?.username,
      updated_by: user?.username,
    };
    postPaymentTypeMutation(finalData); 
  };

  return (
    <Modal
      title="Add Payment Type"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name?.message}
                    </p>
                  )}
                </div>
     
                <div className="">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    description
                  </label>
                  <input
                    id="description"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description?.message}
                    </p>
                  )}
                </div>
    

        {/* Submit Button */}
        <div className="form-group">
          <Button
            type="primary"
            htmlType="submit"
            loading={posting}
            className="font-bold bg-[#152033] text-white mt-4"
          >
            Add Payment Type
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentTypeModal;
