import { useAppDispatch, useAppSelector } from "../../../store/store-hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addAlert } from "../../../store/slices/alert/alertSlice";
import { postKanda } from "../../../helpers/ApiConnectors"; 
import { Button, Form, Input, Modal } from "antd";

interface AddEditKandaProps {
  mode: "add" | "edit";
  initialData: {
    id?: number;
    name: string;
    address?: string;
    jina_kiongozi: string;
    namba_ya_simu?: string;
    location?: string;
  };
  handleCancel: () => void;
}

// Validation schema for Kanda form
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  jina_kiongozi: yup.string().required("Leader's name is required"),
  namba_ya_simu: yup
    .string()
    .nullable()
    .matches(/^[0-9]{10,12}$/, "Phone number must be between 10-12 digits")
    .notRequired(),
  address: yup.string().nullable().notRequired(),
  location: yup.string().nullable().notRequired(),
});

const AddKanda = ({ mode, initialData, handleCancel }: AddEditKandaProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const church = useAppSelector((state: any) => state.sp);
  const currentUser = useAppSelector((state: any) => state?.user?.userInfo);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      address: initialData?.address || '',
      jina_kiongozi: initialData?.jina_kiongozi || '',
      namba_ya_simu: initialData?.namba_ya_simu || '',
      location: initialData?.location || '',
    },
  });

  const { mutate: postKandaMutation, isPending: posting } = useMutation({
    mutationFn: async (data: any) => {
      if (mode === "edit" && initialData.id) {
        //Kanda update
      } else {
        return await postKanda(data);
      }
    },
    onSuccess: () => {
      dispatch(
        addAlert({
          message: mode === 'edit' ? 'Kanda updated successfully!' : 'Kanda added successfully!',
          title: mode === 'edit' ? 'Edit Success' : 'Add Success',
          type: 'success',
        })
      );
      queryClient.invalidateQueries({ queryKey: ['Kanda'] });
      handleCancel();
      reset();
    },
    onError: (error) => {
      dispatch(
        addAlert({
          message: error.message || 'Something went wrong!',
          title: mode === 'edit' ? 'Edit Failed' : 'Add Failed',
          type: 'error',
        })
      );
    },
  });

  // Form submit handler
  const onSubmit = (data: any) => {
    const finalData = {
      ...data,
      church: church?.id,
      created_by: currentUser?.username,
      updated_by: currentUser?.username,
    };
    postKandaMutation(finalData);
  };

  return (
    <Modal
      title={mode === "edit" ? "Edit Kanda" : "Add Kanda"}
      open={true}
      onCancel={handleCancel}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item label="Kanda Name" validateStatus={errors.name ? "error" : ""} help={errors.name?.message}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => <Input {...field} placeholder="Kanda Name" />}
          />
        </Form.Item>

        <Form.Item label="Leader's Name" validateStatus={errors.jina_kiongozi ? "error" : ""} help={errors.jina_kiongozi?.message}>
          <Controller
            control={control}
            name="jina_kiongozi"
            render={({ field }) => <Input {...field} placeholder="Leader's Name" />}
          />
        </Form.Item>

        <Form.Item label="Phone Number" validateStatus={errors.namba_ya_simu ? "error" : ""} help={errors.namba_ya_simu?.message}>
          <Controller
            control={control}
            name="namba_ya_simu"
            render={({ field }:any) => <Input {...field} placeholder="Phone Number" />}
          />
        </Form.Item>

        <Form.Item label="Address" validateStatus={errors.address ? "error" : ""} help={errors.address?.message}>
          <Controller
            control={control}
            name="address"
            render={({ field }:any) => <Input {...field} placeholder="Address" />}
          />
        </Form.Item>

        <Form.Item label="Location" validateStatus={errors.location ? "error" : ""} help={errors.location?.message}>
          <Controller
            control={control}
            name="location"
            render={({ field }:any) => <Input {...field} placeholder="Location" />}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={posting}
          className="font-bold bg-[#152033] text-white mt-4 w-full"
        >
          {mode === 'edit' ? 'Update Kanda' : 'Create Kanda'}
        </Button>
      </Form>
    </Modal>
  );
};

export default AddKanda;
