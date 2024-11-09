// src/components/AddExpenseModal.tsx

import React, { useEffect } from 'react';
import { Button, Modal, message, Input, InputNumber, DatePicker, Select, Spin } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchtExpCat, postExpenses, updateExpence } from '../../helpers/ApiConnectors';
import { useAppDispatch, useAppSelector } from '../../store/store-hooks';
import { addAlert } from '../../store/slices/alert/alertSlice';
import moment from 'moment';

const { Option } = Select;

interface AddExpenseModalProps {
  openModal: boolean;
  handleCancel: () => void;
  expense?: Expense | null;
}

interface FormData {
  expenseCategory: number;
  spentBy: string;
  amount: number;
  date: Date;
}

const schema = yup.object().shape({
  expenseCategory: yup
    .number()
    .typeError('Category is required')
    .required('Category is required'),
  spentBy: yup.string().required('Spent by is required'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .required('Amount is required')
    .positive('Amount must be positive'),
  date: yup
    .date()
    .typeError('Date is required')
    .required('Date is required'),
});

export interface Expense {
  id: number;
  church: number;
  amount: string;
  date: string;
  spent_by: string;
  expense_category: number;
  inserted_by: string;
  inserted_at: string;
  updated_by: string;
  updated_at: string;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ openModal, handleCancel, expense }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: any) => state.user.userInfo);
  const church = useAppSelector((state: any) => state.sp);
  const queryClient = useQueryClient();
  const {
    data: expensecats,
    isLoading: loadCategory,
    error,
  } = useQuery({
    queryKey: ["expensecats"],
    queryFn: async () => {
      const response: any = await fetchtExpCat(`?church_id=${church.id}`);
      return response;
    },
  });

  const { mutate: saveExpense, isPending: posting } = useMutation({
    mutationFn: async (data: any) => {
      const response = expense
        ? await updateExpence(expense.id, data)
        : await postExpenses(data);
      return response;
    },
    onSuccess: () => {
      dispatch(
        addAlert({
          title: 'Success',
          message: expense ? 'Expense updated successfully!' : 'Expense added successfully!',
          type: 'success',
        })
      );
      reset();
      handleCancel();
      queryClient.invalidateQueries({ queryKey: ["expenses", "expence_stats"] });
    },
    onError: () => {
      dispatch(
        addAlert({
          title: 'Error',
          message: expense ? 'Failed to update expense. Please try again.' : 'Failed to add expense. Please try again.',
          type: 'error',
        })
      );
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: expense
      ? {
          expenseCategory: expense.expense_category,
          spentBy: expense.spent_by,
          amount: parseFloat(expense.amount),
          date: moment(expense.date, 'YYYY-MM-DD').toDate(),
        }
      : {},
  });

  const onSubmit = (data: FormData) => {
    const expenseData = {
      church: church.id,
      expense_category: data.expenseCategory,
      spent_by: data.spentBy,
      amount: data.amount.toString(),
      date: moment(data.date).format('YYYY-MM-DD'),
      inserted_by: user.username,
      updated_by: user.username,
    };

    saveExpense(expenseData);
  };

  useEffect(() => {
    if (!openModal) {
      reset();
    } else if (expense) {
      reset({
        expenseCategory: expense.expense_category,
        spentBy: expense.spent_by,
        amount: parseFloat(expense.amount),
        date: moment(expense.date, 'YYYY-MM-DD').toDate(),
      });
    } else {
      reset();
    }
  }, [openModal, expense, reset]);

  return (
    <Modal
      title={expense ? "Edit Expense" : "Add Expense"}
      open={openModal}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      width={600}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Expense Category</label>
          {loadCategory ? (
            <Spin />
          ) : (
            <Controller
              name="expenseCategory"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Expense Category"
                  className="w-full"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children.toLowerCase().includes(input.toLowerCase())
                  }
                  notFoundContent="No categories found"
                >
                  {expensecats?.map((category: any) => (
                    <Option key={category.id} value={category.id}>
                      {category.category_name}
                    </Option>
                  ))}
                </Select>
              )}
            />
          )}
          {errors.expenseCategory && (
            <p className="text-sm text-red-600">{errors.expenseCategory.message}</p>
          )}
        </div>

               {/* Spent By Field */}
               <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Spent By</label>
          <Controller
            name="spentBy"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter name of the person who spent"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.spentBy ? 'border-red-500' : 'border-gray-300'
                } rounded-md bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            )}
          />
          {errors.spentBy && (
            <p className="text-sm text-red-600">{errors.spentBy.message}</p>
          )}
        </div>

        {/* Amount Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Amount (Tzs)</label>
          <Controller
            name="amount"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <InputNumber
                {...field}
                style={{ width: '100%' }}
                min={0}
                placeholder="Enter amount in Tzs"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                } rounded-md bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            )}
          />
          {errors.amount && (
            <p className="text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        {/* Date Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <Controller
            name="date"
            control={control}
            render={({ field }:any) => (
              <DatePicker
                {...field}
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
                onChange={(date) => field.onChange(date)}
                value={field.value ? moment(field.value) : null}
                placeholder="Select date"
              />
            )}
          />
          {errors.date && (
            <p className="text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <Button
          type="primary"
          htmlType="submit"
          loading={posting}
          block
          className="bg-[#152033] text-white font-bold rounded-md shadow-sm hover:bg-[#1b2a45] focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {expense ? "Update Expense" : "Add Expense"}
        </Button>
      </form>
    </Modal>
  );
};

export default AddExpenseModal;
