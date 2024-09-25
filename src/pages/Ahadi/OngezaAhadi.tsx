import React, { useState } from 'react';
import { Button, Form, Modal, Row, message , Input, Col} from 'antd';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


type modalType = {
    openMOdal: any;
    handleCancel: any;
  };

  const schema = yup.object().shape({
    memberNumber: yup.string().required('Namba ya Muhumini is required'),
    contributionCode: yup.string().required('Code ya Mchango is required'),
    amount: yup.number().required('Amount is required').positive('Amount must be positive'),
    promiseDate: yup.date().required('Tarehe ya ahadi is required'),
  });
  
const OngezaAhadi = ({ openMOdal, handleCancel }: modalType) => {
    

  const [confirmLoading, setConfirmLoading] = useState(false);

  // react-hook-form setup with yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setConfirmLoading(true);
    try {
      console.log(data);
      message.success('Ahadi added successfully');
      window.location.reload();
    } catch (error) {
      message.warning('Failed to add ahadi, try again later');
    }
    setConfirmLoading(false);
  };
  // const [errorMsg, setErrorMsg] = useState<string>();

  const onFinish = async (values: never) => {
    setConfirmLoading(true);

    try {
      console.log(values);

      //NOTIFACTION
      message.success("crop added successfully");
      window.location.reload();
    } catch (error) {
      message.warning("failed to add role try again lated");
    }
    setConfirmLoading(false);
  };

  return (
    <>
    
      <Modal title="Ongeza ahadi" open={openMOdal}  onCancel={handleCancel}>
      <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Namba ya Muhumini
            </label>
            <input
              {...register('memberNumber')}
              placeholder="Namba Muhumini"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.memberNumber ? 'border-red-500' : 'border-gray-300'
              } rounded-md  bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.memberNumber && (
              <p className="text-sm text-red-600">{errors.memberNumber?.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Code ya Mchango
            </label>
            <input
              {...register('contributionCode')}
              placeholder="Code ya Mchango"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.contributionCode ? 'border-red-500' : 'border-gray-300'
              } rounded-md  bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.contributionCode && (
              <p className="text-sm text-red-600">{errors.contributionCode?.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Amount (Tzs)
            </label>
            <input
              {...register('amount')}
              type="number"
              placeholder="Amount Tzs"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              } rounded-md  bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount?.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tarehe ya Ahadi
            </label>
            <input
              {...register('promiseDate')}
              type="date"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.promiseDate ? 'border-red-500' : 'border-gray-300'
              } rounded-md  bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.promiseDate && (
              <p className="text-sm text-red-600">{errors.promiseDate?.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={confirmLoading}
            className="w-full px-4 py-2 bg-[#152033] text-white font-bold rounded-md shadow-sm hover:bg-[#1b2a45] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {confirmLoading ? 'Loading...' : 'Ongeza Ahadi'}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default OngezaAhadi;
