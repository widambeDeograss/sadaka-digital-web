import React from "react";
import { Modal, Button, Input } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query"; // React Query for handling API calls
import { postExpCat } from "../../../helpers/ApiConnectors"; // Custom API function for posting Expense Category
import { useAppDispatch, useAppSelector } from "../../../store/store-hooks";
import { addAlert } from "../../../store/slices/alert/alertSlice";
import { toast } from "react-toastify";

// Yup validation schema
const schema = yup.object().shape({
  name: yup.string().required("Expense Category name is required"),
  budget: yup.number().required("Budget is required"),
});

const ExpenseCategoryModal = ({ visible, onClose }: any) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const church = useAppSelector((state: any) => state.sp);
  const user = useAppSelector((state: any) => state.user.userInfo);
  const dispatch = useAppDispatch();

  // API mutation using React Query
  const { mutate: postExpenseCategoryMutation, isPending: posting } = useMutation({
    mutationFn: async (data) => {
      const response = await postExpCat(data);
      return response;
    },
    onSuccess: () => {
      dispatch(
        addAlert({
          title: "Success",
          message: "Expense Category added successfully!",
          type: "success",
        })
      );
      onClose();
      reset();
    },
    onError: (error) => {
      toast.error("Failed to add Expense Category. Please try again.");
      dispatch(
        addAlert({
          title: "Error",
          message: "Failed to add Expense Category.",
          type: "error",
        })
      );
    },
  });

  // Form submit handler
  const onSubmit = (data: any) => {
    const finalData = {
      ...data,
      category_name:data.name,
      church: church?.id, 
      inserted_by: user?.username,
      updated_by: user?.username,
    };
    postExpenseCategoryMutation(finalData); 
  };

  return (
    <Modal
      title="Add Expense Category"
      open={visible}
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
                    htmlFor="budget"
                    className="block text-sm font-medium text-gray-700"
                  >
                    budget
                  </label>
                  <input
                    id="budget"
                    type="number"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      errors.budget ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("budget")}
                  />
                  {errors.budget && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.budget?.message}
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
            Add Expense Category
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseCategoryModal;
