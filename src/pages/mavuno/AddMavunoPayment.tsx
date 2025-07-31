import React, { useEffect, useState } from "react";
import { Modal, Form, InputNumber, Select, Spin, Button, Tabs } from "antd";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchWahumini,
  fetchMavuno,
  fetchPayTypes,
  postMavunoPayment,
  updateMavunoPayment,
  postSpRevenue,
} from "../../helpers/ApiConnectors";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { addAlert } from "../../store/slices/alert/alertSlice";

const { Option } = Select;
const { TabPane } = Tabs;

// Validation Schema
const schema = yup.object().shape({
  mavuno: yup
    .number()
    .typeError("Mavuno ni lazima uachaguliwe")
    .required("Mavuno ni lazima uachaguliwe"),
  amount: yup
    .number()
    .typeError("Kiasi lazima kiwe namba")
    .positive("Kiasi lazima kiwe chanya")
    .required("Kiasi ni lazima"),
  mhumini: yup.number().nullable().typeError("Muumini lazima awe namba"),
  payment_type: yup
    .number()
    .typeError("Aina ya Malipo lazima ichaguliwe")
    .required("Aina ya Malipo ni lazima"),
});

// Props Interface
interface OngezaMavunoPaymentsProps {
  visible: boolean;
  onCancel: () => void;
  editData?: any; 
  mavunoType?: string; 
}

type RevenuePostRequest = {
    amount: string;
    church: number; 
    payment_type: number; 
    revenue_type: string;
    revenue_type_record: string;
    date_received: string;
    created_by: string;
    updated_by: string;
  };
  
// Component
const OngezaMavunoPayments: React.FC<OngezaMavunoPaymentsProps> = ({
  visible,
  onCancel,
  editData,
  mavunoType,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const dispatch = useAppDispatch();
  const church = useAppSelector((state: any) => state.sp);
  const user = useAppSelector((state: any) => state.user.userInfo);
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
      }, 500); // 500ms debounce
    
      return () => clearTimeout(timeout);
    }, [searchTerm]);

  useEffect(() => {
    setIsEditMode(!!editData);
  }, [editData]);

  const { data: wahuminiList, isLoading: isLoadingWahumini } = useQuery({
    queryKey: ['wahumini', debouncedSearchTerm],
    queryFn: async () => {
      const response: any = await fetchWahumini(`?church_id=${church?.id}&search=${debouncedSearchTerm}`);
      return response?.results || []; 
    },
    enabled: !!church?.id,
  });

  const { data: mavunoList, isLoading: isLoadingMavuno } = useQuery({
    queryKey: ["mavuno", church.id],
    queryFn: async () => {
      return await fetchMavuno(`?church_id=${church.id}&mavuno_type=${mavunoType}`);
    },
  });

  const { data: payTypes, isLoading: payTypesLoading } = useQuery({
    queryKey: ["payTypes", church.id],
    queryFn: async () => {
      return await fetchPayTypes(`?church_id=${church.id}`);
    },
  });

  const { mutate: handleSave, isPending: saving } = useMutation({
    mutationFn: async (data: any) => {
      if (isEditMode) {
     await updateMavunoPayment(editData.id, data);
      }
      const response:any  =   await postMavunoPayment(data);
      const localDate = new Date();
      const formattedDate = localDate.toLocaleDateString("en-CA"); 
      const revenueData:RevenuePostRequest = {
        amount: data.amount,
        church: church?.id,
        payment_type: data.payment_type,
        revenue_type_record: response?.id,
        date_received: formattedDate,
        created_by: user?.username,
        updated_by: user?.username,
        revenue_type: "Mavuno"
      }
      const revenueResponse = await postSpRevenue(revenueData);
      return revenueResponse;
      
    },
    onSuccess: () => {
      dispatch(
        addAlert({
          title: "Success",
          message: isEditMode
            ? "Mavuno Payment updated successfully!"
            : "Mavuno Payment added successfully!",
          type: "success",
        })
      );
      reset();
      onCancel();
    },
    onError: () => {
      dispatch(
        addAlert({
          title: "Error",
          message: "Failed to save Mavuno Payment.",
          type: "error",
        })
      );
    },
  });

  // Form Handling
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      mavuno: editData?.mavuno || undefined,
      amount: editData?.amount || 0,
      payment_type: editData?.payment_type || undefined,
      mhumini: editData?.mhumini || undefined,
    },
  });

  useEffect(() => {
    if (editData) {
      Object.keys(editData).forEach((key:any) => {
        setValue(key, editData[key]);
      });
    }
  }, [editData, setValue]);

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      inserted_by: user.username,
      updated_by: user.username,
    };
    handleSave(payload);
  };

  return (
    <Modal
      visible={visible}
      title={isEditMode ? "Edit Mavuno Payment" : "Add Mavuno Payment"}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={700}
    >
      <Tabs defaultActiveKey="1">
        {/* Tab: With Muumini */}
        <TabPane tab="With Muumini" key="1">
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            {/* Muumini Field */}
            <Form.Item
              label="Muumini"
              validateStatus={errors.mhumini ? "error" : ""}
              help={errors.mhumini?.message}
            >
              {isLoadingWahumini ? (
                <Spin />
              ) : (
                <Controller
                  name="mhumini"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch
                      placeholder="Chagua Muumini"
                      onSearch={(value) => setSearchTerm(value)} 
                      filterOption={false} 
                      allowClear
                    >
                      {wahuminiList?.map((item: any) => (
                        <Option key={item.id} value={item.id}>
                          {item.first_name} {item.last_name}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              )}
            </Form.Item>
            {/* Common Fields */}
            <CommonFormFields
              mavunoList={mavunoList}
              payTypes={payTypes}
              isLoadingMavuno={isLoadingMavuno}
              payTypesLoading={payTypesLoading}
              control={control}
              errors={errors}
              saving={saving}
            />
          </Form>
        </TabPane>

        {/* Tab: Without Muumini */}
        <TabPane tab="Without Muumini" key="2">
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            {/* Common Fields */}
            <CommonFormFields
              mavunoList={mavunoList}
              payTypes={payTypes}
              isLoadingMavuno={isLoadingMavuno}
              payTypesLoading={payTypesLoading}
              control={control}
              errors={errors}
              saving={saving}
            />
          </Form>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

// Common Form Fields Component
const CommonFormFields = ({
  mavunoList,
  payTypes,
  isLoadingMavuno,
  payTypesLoading,
  control,
  errors,
  saving
}: any) => (
  <>
    {/* Mavuno Select */}
    <Form.Item
      label="Mavuno"
      validateStatus={errors.mavuno ? "error" : ""}
      help={errors.mavuno?.message}
    >
      {isLoadingMavuno ? (
        <Spin />
      ) : (
        <Controller
          name="mavuno"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              showSearch
              placeholder="Chagua Mavuno"
              optionFilterProp="children"
              notFoundContent="Hajapatikana"
            >
              {mavunoList?.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.name} -- {item.mavuno_type}
                </Option>
              ))}
            </Select>
          )}
        />
      )}
    </Form.Item>

    {/* Amount */}
    <Form.Item
      label="Kiasi (Tzs)"
      validateStatus={errors.amount ? "error" : ""}
      help={errors.amount?.message}
    >
      <Controller
        name="amount"
        control={control}
        render={({ field }) => (
          <InputNumber {...field} min={0} style={{ width: "100%" }} 
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value ? parseFloat(value.replace(/\$\s?|(,*)/g, '')) : 0}
          />
        )}
      />
    </Form.Item>

    {/* Payment Type */}
    <Form.Item
      label="Payment Type"
      validateStatus={errors.payment_type ? "error" : ""}
      help={errors.payment_type?.message}
    >
      {payTypesLoading ? (
        <Spin />
      ) : (
        <Controller
          name="payment_type"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              showSearch
              placeholder="Chagua Aina ya Malipo"
              optionFilterProp="children"
              notFoundContent="Haijapatikana"
            >
              {payTypes?.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        />
      )}
    </Form.Item>
    <Button type="primary" htmlType="submit" block 
          className="bg-[#152033] text-white"
          loading={saving}
    >
      Save
    </Button>
  </>
);

export default OngezaMavunoPayments;
