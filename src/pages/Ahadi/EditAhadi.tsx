// src/components/EditAhadi.tsx
import React, {  useEffect } from "react";
import {
  Modal,
  InputNumber,
  Select,
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
  updateAhadi,
} from "../../helpers/ApiConnectors";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { addAlert } from "../../store/slices/alert/alertSlice";

const { Option } = Select;

interface EditAhadiProps {
  openModal: boolean;
  handleCancel: () => void;
  ahadiData: any; 
}

const schema = yup.object().shape({
  wahumini: yup
    .number()
    .typeError("Muumini ni lazima uachaguliwe")
    .required("Muumini ni lazima uachaguliwe"),
  mchango: yup
    .number()
    .typeError("Mchango ni lazima uachaguliwe")
    .nullable(), // Optional if without mchango
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

const EditAhadi: React.FC<EditAhadiProps> = ({
  openModal,
  handleCancel,
  ahadiData,
}) => {
  const dispatch = useAppDispatch();
  const church = useAppSelector((state: any) => state.sp);
  const user = useAppSelector((state: any) => state.user.userInfo);

  const { data: wahumini, isLoading: loadWahumini } = useQuery({
    queryKey: ["wahumini"],
    queryFn: async () => {
      const response:any = await fetchWahumini(`?church_id=${church.id}`);
      return response;
    },
  });

  const { data: michango, isLoading: loadingMichango } = useQuery({
    queryKey: ["michango"],
    queryFn: async () => {
      const response:any = await fetchMichango(`?church_id=${church.id}`);
      return response;
    },
  });

  const { mutate: updateAhadiMutation, isPending: updating } = useMutation({
    mutationFn: async (data: any) => {
      const response = await updateAhadi(ahadiData.id,data);
      return response;
    },
    onSuccess: () => {
      dispatch(
        addAlert({
          title: "Mafanikio",
          message: "Ahadi update success!",
          type: "success",
        })
      );
      handleCancel();
    },
    onError: (error: any) => {
      dispatch(
        addAlert({
          title: "Hitilafu",
          message:
            error?.response?.data?.detail ||
            "Imeshindikana kubadili ahadi. Tafadhali jaribu tena.",
          type: "error",
        })
      );
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      wahumini: ahadiData?.wahumini,
      mchango: ahadiData?.mchango,
      amount: ahadiData?.amount,
    //   promiseDate: moment(ahadiData?.date_pledged).toDate(),
    //   dueDate: moment(ahadiData?.due_date).toDate(),
      remark: ahadiData?.remark,
    },
  });

  const onSubmit = (data: any) => {
    const updatedAhadiData = {
      id: ahadiData.id,
      wahumini: data.wahumini,
      mchango: data.mchango || null,
      amount: data.amount,
    //   date_pledged: moment(data.promiseDate).format("YYYY-MM-DD"),
    //   due_date: moment(data.dueDate).format("YYYY-MM-DD"),
      remark: data.remark,
      updated_by: user.username,
    };

    updateAhadiMutation(updatedAhadiData);
  };

  useEffect(() => {
    if (ahadiData) {
      setValue("wahumini", ahadiData.wahumini);
      setValue("mchango", ahadiData.mchango);
      setValue("amount", ahadiData.amount);
    //   setValue("promiseDate", moment(ahadiData.date_pledged).toDate());
    //   setValue("dueDate", moment(ahadiData.due_date).toDate());
      setValue("remark", ahadiData.remark);
    }
  }, [ahadiData, setValue]);

  return (
    <Modal
      title="Edit Ahadi"
      open={openModal}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      width={700}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label>Muumini</label>
          {loadWahumini ? (
            <Spin />
          ) : (
            <Controller
              name="wahumini"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Chagua Muumini" className="w-full">
                  {wahumini?.map((wahumini: any) => (
                    <Option key={wahumini.id} value={wahumini.id}>
                      {wahumini.first_name} {wahumini.last_name}
                    </Option>
                  ))}
                </Select>
              )}
            />
          )}
          {errors.wahumini && <p>{errors.wahumini.message}</p>}
        </div>

        {/* Mchango Select Field */}
        <div className="mb-4 w-full">
              <label className="block text-sm font-medium text-gray-700">
                Mchango
              </label>
              {loadingMichango ? (
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
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value ? parseFloat(value.replace(/\$\s?|(,*)/g, '')) : 0}
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

        <Button type="primary" htmlType="submit"   className="bg-[#152033]" loading={updating} block>
          Edit Ahadi
        </Button>
      </form>
    </Modal>
  );
};

export default EditAhadi;
