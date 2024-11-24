import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Form, Input, Modal, Select } from "antd";
import { useAppDispatch, useAppSelector } from "../../../store/store-hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addAlert } from "../../../store/slices/alert/alertSlice";
import { postJumuiya, fetchtKanda, updateJumuiya } from "../../../helpers/ApiConnectors";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface AddEditJumuiyaProps {
  mode: "add" | "edit";
  initialData: {
    id?: number;
    name: string;
    address?: string;
    jina_kiongozi: string;
    kanda?: number; // Assuming kanda is a number (ID)
    namba_ya_simu?: string;
    location?: string;
  } | null;
  handleCancel: () => void;
}

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  address: yup.string(),
  jina_kiongozi: yup.string().required("Leader's name is required"),
  kanda: yup.number().required("Kanda selection is required"),
  namba_ya_simu: yup.string().max(12, "Phone number cannot exceed 12 digits"),
  location: yup.string(),
});

const AddJumuiya: React.FC<AddEditJumuiyaProps> = ({
  mode,
  initialData,
  handleCancel,
}) => {
  const dispatch = useAppDispatch();
  const church = useAppSelector((state: any) => state.sp);
  const currentUser = useAppSelector((state: any) => state?.user?.userInfo);
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    //@ts-ignore
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      name: "",
      address: "",
      jina_kiongozi: "",
      //   kanda: undefined,
      namba_ya_simu: "",
      location: "",
    },
  });

  const { data: kandas,  } = useQuery({
    queryKey: ["kanda"],
    queryFn: async () => {
      const response: any = await fetchtKanda(`?church_id=${church.id}`);
      return response;
    },
  });

  const { mutate: postJumuiyaMutation, isPending } = useMutation({
    mutationFn: async (data: any) => {
      if (mode === "edit" && initialData) {
       return await updateJumuiya(initialData?.id, data);
      } else {
        return await postJumuiya(data);
      }
    },
    onSuccess: () => {
      dispatch(
        addAlert({
          message:
            mode === "edit"
              ? "Jumuiya updated successfully!"
              : "Jumuiya added successfully!",
          title: mode === "edit" ? "Edit Success" : "Add Success",
          type: "success",
        })
      );
      queryClient.invalidateQueries({ queryKey: ["jumuiya"] });
      handleCancel();
      reset();
    },
    onError: (error) => {
      dispatch(
        addAlert({
          message: error.message || "Something went wrong!",
          title: mode === "edit" ? "Edit Failed" : "Add Failed",
          type: "error",
        })
      );
    },
  });

  const onSubmit = (data: any) => {
    const finalData = {
      ...data,
      church: church?.id,
      created_by: currentUser?.username,
      updated_by: currentUser?.username,
    };
    postJumuiyaMutation(finalData);
  };

  return (
    <Modal
      title={mode === "edit" ? "Edit Jumuiya" : "Add Jumuiya"}
      open={true}
      onCancel={handleCancel}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Name"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input {...field} placeholder="Jumuiya name" />
            )}
          />
        </Form.Item>

        <Form.Item label="Address">
          <Controller
            control={control}
            name="address"
            render={({ field }) => <Input {...field} placeholder="Address" />}
          />
        </Form.Item>

        <Form.Item
          label="Leader's Name"
          validateStatus={errors.jina_kiongozi ? "error" : ""}
          help={errors.jina_kiongozi?.message}
        >
          <Controller
            control={control}
            name="jina_kiongozi"
            render={({ field }) => (
              <Input {...field} placeholder="Leader's Name" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Kanda"
          validateStatus={errors.kanda ? "error" : ""}
          help={errors.kanda?.message}
        >
          <Controller
            control={control}
            name="kanda"
            render={({ field }) => (
              <Select {...field} placeholder="Select Kanda"
              optionFilterProp="children"
              showSearch
              filterOption={(input, option) =>
                option?.children
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              notFoundContent="Hajapatikana"
              >
                {kandas?.map((kanda: any) => (
                  <Select.Option key={kanda.id} value={kanda.id}>
                    {kanda.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          validateStatus={errors.namba_ya_simu ? "error" : ""}
          help={errors.namba_ya_simu?.message}
        >
          <Controller
            control={control}
            name="namba_ya_simu"
            render={({ field }) => (
              <Input {...field} placeholder="Phone Number" />
            )}
          />
        </Form.Item>

        <Form.Item label="Location">
          <Controller
            control={control}
            name="location"
            render={({ field }) => <Input {...field} placeholder="Location" />}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={isPending}
          className="font-bold bg-[#152033] text-white mt-4 w-full"
        >
          {mode === "edit" ? "Update Jumuiya" : "Create Jumuiya"}
        </Button>
      </Form>
    </Modal>
  );
};

export default AddJumuiya;
