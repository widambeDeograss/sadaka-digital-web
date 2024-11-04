// src/components/OngezaAhadi.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  Tabs,
  Form,
  InputNumber,
  Select,
  message,
  Spin,
  Button,
  Input,
  DatePicker,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchWahumini,
  fetchMichango,
  postAhadi,
} from "../../helpers/ApiConnectors";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { addAlert } from "../../store/slices/alert/alertSlice";
import moment from "moment";

const { TabPane } = Tabs;
const { Option } = Select;

interface OngezaAhadiProps {
  openModal: boolean;
  handleCancel: () => void;
}

interface FormDataWithMchango {
  wahumini: number;
  mchango: number;
  amount: number;
  promiseDate: string;
  dueDate: string;
  remark: string;
}

interface FormDataWithoutMchango {
  wahumini: number;
  amount: number;
  promiseDate: string;
  dueDate: string;
  remark: string;
}

const schemaWithMchango = yup.object().shape({
  wahumini: yup
    .number()
    .typeError("Muhumini ni lazima uachaguliwe")
    .required("Muhumini ni lazima uachaguliwe"),
  mchango: yup
    .number()
    .typeError("Mchango ni lazima uachaguliwe")
    .required("Mchango ni lazima uachaguliwe"),
  amount: yup
    .number()
    .typeError("Kiasi lazima kiwe namba")
    .positive("Kiasi lazima kiwe chanya")
    .required("Kiasi ni lazima"),
  promiseDate: yup
    .date()
    .typeError("Tarehe ya Ahadi ni lazima")
    .required("Tarehe ya Ahadi ni lazima"),
  dueDate: yup
    .date()
    .typeError("Tarehe ya Kulipa ni lazima")
    .required("Tarehe ya Kulipa ni lazima"),
  remark: yup.string().required("Maelezo ni lazima"),
});

const schemaWithoutMchango = yup.object().shape({
  wahumini: yup
    .number()
    .typeError("Muhumini ni lazima uachaguliwe")
    .required("Muhumini ni lazima uachaguliwe"),
  amount: yup
    .number()
    .typeError("Kiasi lazima kiwe namba")
    .positive("Kiasi lazima kiwe chanya")
    .required("Kiasi ni lazima"),
  promiseDate: yup
    .date()
    .typeError("Tarehe ya Ahadi ni lazima")
    .required("Tarehe ya Ahadi ni lazima"),
  dueDate: yup
    .date()
    .typeError("Tarehe ya Kulipa ni lazima")
    .required("Tarehe ya Kulipa ni lazima"),
  remark: yup.string().required("Maelezo ni lazima"),
});

const OngezaAhadi: React.FC<OngezaAhadiProps> = ({
  openModal,
  handleCancel,
}) => {
  const [activeTab, setActiveTab] = useState<"withMchango" | "withoutMchango">(
    "withMchango"
  );
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: any) => state.user.userInfo);
  const church = useAppSelector((state: any) => state.sp);

  const {
    data: wahumini,
    isLoading: loadWahumini,
    error,
  } = useQuery({
    queryKey: ["wahumini"],
    queryFn: async () => {
      const response: any = await fetchWahumini(`?church_id=${church.id}`);
      console.log(response);
      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  const { data: michango, isLoading: loadingmichango } = useQuery({
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

  
  // Mutation for posting Zaka
  const { mutate: postAhadiMutation, isPending: posting } = useMutation({
    mutationFn: async (data: any) => {
      const response = await postAhadi(data);
      return response;
    },
    onSuccess: () => {
        dispatch(
          addAlert({
            title: "Mafanikio",
            message: "Ahadi imeongezwa kwa mafanikio!",
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
            "Imeshindikana kuongeza ahadi. Tafadhali jaribu tena.",
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
  } = useForm<FormDataWithMchango | FormDataWithoutMchango >({
    // @ts-ignore
    resolver: yupResolver(
      activeTab === "withMchango" ? schemaWithMchango : schemaWithoutMchango
    ),
  });

  // Handle form submission
  const onSubmit = (data: FormDataWithMchango | FormDataWithoutMchango) => {
    const ahadiData = {
      wahumini: data.wahumini,
      church:church?.id,
      mchango:
        activeTab === "withMchango" ? (data as FormDataWithMchango).mchango : null,
      amount: data.amount,
      paid_amount: 0, 
      date_pledged: moment(data.promiseDate).format("YYYY-MM-DD"),
      due_date: moment(data.dueDate).format("YYYY-MM-DD"),
      remark: data.remark,
      created_by: user.username, 
      updated_by: user.username, 
    };

    postAhadiMutation(ahadiData);
  };

  // Handle tab change
  const handleTabChange = (key: string) => {
    setActiveTab(key as "withMchango" | "withoutMchango");
    reset(); // Reset form when switching tabs
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!openModal) {
      reset();
    }
  }, [openModal, reset]);

  return (
    <Modal
      title="Ongeza Ahadi"
      open={openModal}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      width={700}
    >
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        {/* Tab 1: Ahadi Mchango */}
        <TabPane tab="Ahadi Mchango" key="withMchango">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Muhumini Select Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Muhumini
              </label>
              {loadWahumini ? (
                <Spin />
              ) : (
                <Controller
                  name="wahumini"
                  control={control}
                  defaultValue={undefined}
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch
                      placeholder="Chagua Muhumini"
                      optionFilterProp="children"
                      className="w-full"
                      filterOption={(input, option) =>
                        option?.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      notFoundContent="Hajapatikana"
                    >
                      {wahumini?.map((wahumini:any) => (
                        <Option key={wahumini.id} value={wahumini.id}>
                          {wahumini.first_name} {wahumini.last_name}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              )}
              {errors.wahumini && (
                <p className="text-sm text-red-600">
                  {errors.wahumini.message}
                </p>
              )}
            </div>

            {/* Mchango Select Field */}
            <div className="mb-4 w-full">
              <label className="block text-sm font-medium text-gray-700">
                Mchango
              </label>
              {loadingmichango ? (
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
                       className="w-full"
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
                      {michango?.map((mchango:any) => (
                        <Option key={mchango.id} value={mchango.id}>
                          {mchango.mchango_name} (Target: Tsh {mchango.target_amount.toLocaleString()})
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              )}
              {/* {errors. && (
                <p className="text-sm text-red-600">{errors.mchango.message}</p>
              )} */}
            </div>

            {/* Amount Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Kiasi (Tzs)
              </label>
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
              {errors.amount && (
                <p className="text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>

            {/* Promise Date Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Tarehe ya Ahadi
              </label>
              <Controller
                name="promiseDate"
                control={control}
                render={({ field }:any) => (
                  <DatePicker
                    {...field}
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                  />
                )}
              />
              {errors.promiseDate && (
                <p className="text-sm text-red-600">
                  {errors.promiseDate.message}
                </p>
              )}
            </div>

            {/* Due Date Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Tarehe ya Kulipa
              </label>
              <Controller
                name="dueDate"
                control={control}
                defaultValue=""
                render={({ field }:any) => (
                  <DatePicker
                    {...field}
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                  />
                )}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-600">{errors.dueDate.message}</p>
              )}
            </div>

            {/* Remark Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Maelezo
              </label>
              <Controller
                name="remark"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Ingiza maelezo"
                  />
                )}
              />
              {errors.remark && (
                <p className="text-sm text-red-600">{errors.remark.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="primary"
              htmlType="submit"
               className="bg-[#152033]"
              loading={posting}
              block
            >
              Ongeza Ahadi
            </Button>
          </form>
        </TabPane>

        {/* Tab 2: Ahadi Bila Mchango */}
        <TabPane tab="Ahadi Bila Mchango" key="withoutMchango">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Muhumini Select Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Muhumini
              </label>
              {loadWahumini ? (
                <Spin />
              ) : (
                <Controller
                  name="wahumini"
                  control={control}
                  defaultValue={undefined}
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch
                      placeholder="Chagua Muhumini"
                       className="w-full"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option?.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      notFoundContent="Hajapatikana"
                    >
                      {wahumini?.map((wahumini:any) => (
                        <Option key={wahumini.id} value={wahumini.id}>
                          {wahumini.first_name} {wahumini.last_name}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              )}
              {errors.wahumini && (
                <p className="text-sm text-red-600">
                  {errors.wahumini.message}
                </p>
              )}
            </div>

            {/* Amount Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Kiasi (Tzs)
              </label>
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
              {errors.amount && (
                <p className="text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>

            {/* Promise Date Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Tarehe ya Ahadi
              </label>
              <Controller
                name="promiseDate"
                control={control}
                defaultValue=""
                render={({ field }:any) => (
                  <DatePicker
                    {...field}
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                  />
                )}
              />
              {errors.promiseDate && (
                <p className="text-sm text-red-600">
                  {errors.promiseDate.message}
                </p>
              )}
            </div>

            {/* Due Date Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Tarehe ya Kulipa
              </label>
              <Controller
                name="dueDate"
                control={control}
                defaultValue=""
                render={({ field }:any) => (
                  <DatePicker
                    {...field}
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                  />
                )}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-600">{errors.dueDate.message}</p>
              )}
            </div>

            {/* Remark Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Maelezo
              </label>
              <Controller
                name="remark"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Ingiza maelezo"
                  />
                )}
              />
              {errors.remark && (
                <p className="text-sm text-red-600">{errors.remark.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[#152033]"
              loading={posting}
              block
            >
              Ongeza Ahadi
            </Button>
          </form>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default OngezaAhadi;
