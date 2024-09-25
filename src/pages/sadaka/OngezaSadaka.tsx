import { useState } from "react";
import {
  Button,
  Form,
  Modal,
  Input,
  message,
  Tabs,
  Space,
  Row,
  Col,
} from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

type modalType = {
  openMOdal: any;
  handleCancel: any;
};

const OngezaSadaka = ({ openMOdal, handleCancel }: modalType) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  // const [errorMsg, setErrorMsg] = useState<string>();
  // Yup validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Customer name is required"),
    phone: Yup.string().required("Customer phone is required"),
    tin: Yup.string().required("Customer tin is required"),
  });

  // useForm setup with yupResolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  return (
    <div>
      <Modal
        title={"Ongeza sadaka"}
        open={openMOdal}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[<div></div>]}
        className="w-full "
      >
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Muhumini" key="1">
            <form action="">
              <div className="grid grid-cols-2 gap-3">
              <div className="">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Namba ya kadi
                </label>
                <input
                  id="name"
                  // name="name"
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
                  htmlFor="tin"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount
                </label>
                <input
                  id="tin"
                  // name="tin"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.tin ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("tin")}
                />
                {errors.tin && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.tin?.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  id="name"
                  // name="name"
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

              <div className="mb-4">
                <label
                  htmlFor="tin"
                  className="block text-sm font-medium text-gray-700"
                >
                  Remark
                </label>
                <input
                  id="tin"
                  // name="tin"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.tin ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("tin")}
                />
                {errors.tin && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.tin?.message}
                  </p>
                )}
              </div>
              </div>
              <Button
                  type="primary"
                  htmlType="submit"
                  className="font-bold bg-[#152033] text-white"
                  style={{ width: "100%" }}
                >
                  Ongeza Sadaka
                </Button>
            </form>
          </TabPane>
          <TabPane tab="Bila namba ya kadi" key="2">
            <form action="">
            <div className="grid grid-cols-2 gap-3">
              <div className="">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount
                </label>
                <input
                  id="namdde"
                  // name="naddme"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-blue-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
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
                  htmlFor="tin"
                  className="block text-sm font-medium text-gray-700"
                >
                  Remark
                </label>
                <input
                  id="tin"
                  // name="tin"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-blue-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.tin ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("tin")}
                />
                {errors.tin && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.tin?.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="tin"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  id="tin"
                  // name="tin"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-blue-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.tin ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("tin")}
                />
                {errors.tin && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.tin?.message}
                  </p>
                )}
              </div>
              </div>
              <Button
                  type="primary"
                  htmlType="submit"
                  className="font-bold bg-[#152033] text-white"
                  style={{ width: "100%" }}
                >
                  Ongeza Sadaka
                </Button>
            </form>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default OngezaSadaka;
