// src/components/OngezaChagizo.tsx

import React, { useState } from "react";
import {
  Modal,
  Tabs,
  Form,
  InputNumber,
  Select,
  message,
  Spin,
  Button,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchWahumini,
   fetchMichango,
   postMichangoPayment
} from "../../helpers/ApiConnectors";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { addAlert } from "../../store/slices/alert/alertSlice";

const { TabPane } = Tabs;
const { Option } = Select;

export interface Wahumini {
  id: number;
  first_name: string;
  last_name: string;
}

export interface MchangoPayment {
  id: number;
  mchango: number; // ID of the Mchango
  amount: number;
  mhumini?: number | null;
  inserted_by: string;
  inserted_at: string; // ISO date string
  updated_by: string;
  updated_at: string; // ISO date string
}

export interface Mchango {
  id: number;
  mchango_name: string;
  target_amount: number;
  collected_amount: number;
}

// Define Props for the Modal
interface OngezaChagizoProps {
  visible: boolean;
  onCancel: () => void;
}

// Define Form Data Interfaces
interface FormDataWithMuhumini {
  mchango: number;
  amount: number;
  mhumini: number;
  remark: string;
}

interface FormDataWithoutMuhumini {
  mchango: number;
  amount: number;
  remark: string;
}

// Define Validation Schemas
const schemaWithMuhumini = yup.object().shape({
  mchango: yup
    .number()
    .typeError("Mchango ni lazima uachaguliwe")
    .required("Mchango ni lazima uachaguliwe"),
  amount: yup
    .number()
    .typeError("Kiasi lazima kiwe namba")
    .positive("Kiasi lazima kiwe chanya")
    .required("Kiasi ni lazima"),
  mhumini: yup
    .number()
    .typeError("Muhumini ni lazima")
    .required("Muhumini ni lazima"),
  remark: yup.string().required("Maelezo ni lazima"),
});

const schemaWithoutMuhumini = yup.object().shape({
  mchango: yup
    .number()
    .typeError("Mchango ni lazima uachaguliwe")
    .required("Mchango ni lazima uachaguliwe"),
  amount: yup
    .number()
    .typeError("Kiasi lazima kiwe namba")
    .positive("Kiasi lazima kiwe chanya")
    .required("Kiasi ni lazima"),
  remark: yup.string().required("Maelezo ni lazima"),
});

const OngezaChagizo: React.FC<OngezaChagizoProps> = ({
  visible,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<"with" | "without">("with");
  const church = useAppSelector((state: any) => state.sp);
  const user = useAppSelector((state: any) => state.user.userInfo);
  const dispatch = useAppDispatch();

  const {
    data: wahuminiList,
    isLoading: isLoadingWahumini,
    error,
  } = useQuery({
    queryKey: ["wahumini"],
    queryFn: async () => {
      const response: any =await fetchWahumini(`?church_id=${church.id}`);
      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  const { data: mchangoList, isLoading: isLoadingMchango } = useQuery({
    queryKey: ["michango"],
    queryFn: async () => {
      const response: any = await fetchMichango(`?church_id=${church.id}`);
      console.log(response);
      return response;
    },
    // {
    //   enabled: false,
    // }
  });


  const { mutate: addMchangoPaymentMutation, isPending: posting } = useMutation({
    mutationFn: async (data: any) => {
      const response = await postMichangoPayment(data);
      return response;
    },
    onSuccess: () => {
      dispatch(
        addAlert({
          title: "Success",
          message: "Contribution added successfully!",
          type: "success",
        })
      );
      reset();
    },
    onError: (error: any) => {
      dispatch(
        addAlert({
          title: "Error",
          message: "Failed to add Contribution.",
          type: "error",
        })
      );
    },
  });

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormDataWithMuhumini | FormDataWithoutMuhumini>({
    resolver: yupResolver(
      activeTab === "with" ? schemaWithMuhumini : schemaWithoutMuhumini
    ),
  });

  const onSubmit = (data: FormDataWithMuhumini | FormDataWithoutMuhumini) => {
    const paymentData: Omit<
      MchangoPayment,
      "id" | "inserted_at" | "updated_at"
    > = {
      mchango: data.mchango,
      amount: data.amount,
      mhumini:
        activeTab === "with" ? (data as FormDataWithMuhumini).mhumini : null,

        inserted_by: user?.username,
        updated_by: user?.username,
    };

    addMchangoPaymentMutation(paymentData);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key as "with" | "without");
    reset(); // Reset form when switching tabs
  };

  return (
    <Modal
      visible={visible}
      title="Ongeza Changizo"
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={600}
    >
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Kwa Muhumini" key="with">
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            {/* Mchango Select Field */}
            <Form.Item
              label="Mchango"
              validateStatus={errors.mchango ? "error" : ""}
              help={errors.mchango?.message}
            >
              {isLoadingMchango ? (
                <Spin />
              ) : (
                <Controller
                  name="mchango"
                  control={control}
                  defaultValue={undefined}
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch
                      placeholder="Chagua Mchango"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option?.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      notFoundContent="Hajapatikana"
                    >
                      {mchangoList?.map((mchango: Mchango) => (
                        <Option key={mchango.id} value={mchango.id}>
                          {mchango.mchango_name}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              )}
            </Form.Item>

            {/* Amount Field */}
            <Form.Item
              label="Kiasi (Tzs)"
              validateStatus={errors.amount ? "error" : ""}
              help={errors.amount?.message}
            >
              <Controller
                name="amount"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="Ingiza kiasi"
                  />
                )}
              />
            </Form.Item>

            {/* Muhumini Select Field */}
            <Form.Item
              label="Muhumini"
            //   validateStatus={errors.mhumini ? "error" : ""}
            //   help={errors.mhumini?.message}
            >
              {isLoadingWahumini ? (
                <Spin />
              ) : (
                <Controller
                  name="mhumini"
                  control={control}
                  defaultValue={undefined}
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch
                      placeholder="Chagua Muhumini"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option?.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      notFoundContent="Hajapatikana"
                    >
                      {wahuminiList?.map((wahumini: Wahumini) => (
                        <Option key={wahumini.id} value={wahumini.id}>
                          {wahumini.first_name} {wahumini.last_name}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              )}
            </Form.Item>

            {/* Remark Field */}
            <Form.Item
              label="Maelezo"
              validateStatus={errors.remark ? "error" : ""}
              help={errors.remark?.message}
            >
              <Controller
                name="remark"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Ingiza maelezo"
                    className="ant-input"
                  />
                )}
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={posting}
                block
              >
                Ongeza Changizo
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Bila Muhumini" key="without">
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            {/* Mchango Select Field */}
            <Form.Item
              label="Mchango"
              validateStatus={errors.mchango ? "error" : ""}
              help={errors.mchango?.message}
            >
              {isLoadingMchango ? (
                <Spin />
              ) : (
                <Controller
                  name="mchango"
                  control={control}
                  defaultValue={undefined}
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch
                      placeholder="Chagua Mchango"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option?.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      notFoundContent="Hajapatikana"
                    >
                      {mchangoList?.map((mchango: Mchango) => (
                        <Option key={mchango.id} value={mchango.id}>
                          {mchango.mchango_name}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              )}
            </Form.Item>

            {/* Amount Field */}
            <Form.Item
              label="Kiasi (Tzs)"
              validateStatus={errors.amount ? "error" : ""}
              help={errors.amount?.message}
            >
              <Controller
                name="amount"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="Ingiza kiasi"
                  />
                )}
              />
            </Form.Item>

            {/* Remark Field */}
            <Form.Item
              label="Maelezo"
              validateStatus={errors.remark ? "error" : ""}
              help={errors.remark?.message}
            >
              <Controller
                name="remark"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Ingiza maelezo"
                    className="ant-input"
                  />
                )}
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={posting}
                block
              >
                Ongeza Changizo
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default OngezaChagizo;
