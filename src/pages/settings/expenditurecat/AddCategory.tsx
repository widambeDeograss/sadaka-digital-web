import  { useEffect } from "react";
import { Modal, Button } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postExpCat, updateExpCat } from "../../../helpers/ApiConnectors"; // API functions
import { useAppDispatch, useAppSelector } from "../../../store/store-hooks";
import { addAlert } from "../../../store/slices/alert/alertSlice";
import { toast } from "react-toastify";

// Yup validation schema
const schema = yup.object().shape({
  name: yup.string().required("Expense Category name is required"),
  budget: yup.number().required("Budget is required"),
});

const ExpenseCategoryModal = ({ visible, onClose, expenseCategory, isEditing }:any) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(schema),
  });
 const queryClient = useQueryClient()
  const church = useAppSelector((state:any) => state.sp);
  const user = useAppSelector((state:any) => state.user.userInfo);
  const dispatch = useAppDispatch();

  // Set form values when editing
  useEffect(() => {
    if (isEditing && expenseCategory) {
      setValue("name", expenseCategory.category_name);
      setValue("budget", expenseCategory.budget);
    }
  }, [isEditing, expenseCategory, setValue]);

  // API mutation using React Query
  const mutation = useMutation({
    mutationFn: async (data) => {
      return isEditing
        ? await updateExpCat(expenseCategory.id, data)  
        : await postExpCat(data);                      
    },
    onSuccess: () => {
      const message = isEditing ? "Expense Category updated successfully!" : "Expense Category added successfully!";
      dispatch(
        addAlert({
          title: "Success",
          message: message,
          type: "success",
        })
      );
      queryClient.invalidateQueries({ queryKey: ["expensecats"] });
      onClose();
      reset();
    },
    onError: () => {
      toast.error("Failed to save Expense Category. Please try again.");
      dispatch(
        addAlert({
          title: "Error",
          message: "Failed to save Expense Category.",
          type: "error",
        })
      );
    },
  });

  // Form submit handler
  const onSubmit = (data:any) => {
    const finalData = {
      ...data,
      category_name: data.name,
      church: church?.id,
      inserted_by: user?.username,
      updated_by: user?.username,
    };
    mutation.mutate(finalData);
  };

  return (
    <Modal
      title={isEditing ? "Edit Expense Category" : "Add Expense Category"}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            {...register("name")}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div className="">
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
            Budget
          </label>
          <input
            id="budget"
            type="number"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
              errors.budget ? "border-red-500" : "border-gray-300"
            }`}
            {...register("budget")}
          />
          {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="form-group">
          <Button
            type="primary"
            htmlType="submit"
            loading={mutation.isPending}
            className="font-bold bg-[#152033] text-white mt-4"
          >
            {isEditing ? "Update Expense Category" : "Add Expense Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseCategoryModal;
