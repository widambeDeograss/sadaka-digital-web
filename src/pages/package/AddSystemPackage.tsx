import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addAlert } from "../../store/slices/alert/alertSlice";
import { postSystemPackage } from "../../helpers/ApiConnectors";
import { Button, Form, Input, Modal } from "antd";

interface AddEditSystemPackage {
  mode: "add" | "edit";

  initialData: {
    id: number;
    name: string;
    description: string;
    price: number;
    duration: string;
    status: boolean;
  };
  handleCancel: () => void;
}

const schema = yup.object().shape({
  description: yup.string().required("description is required"),
  name: yup.string().required("name is required"),
  price: yup.string().required("price is required"),
  duration: yup.string().required("duration is required"),
});

const AddSystemPackage = ({
  mode,
  initialData,
  handleCancel,
}: AddEditSystemPackage) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const currentUser = useAppSelector((state: any) => state?.user.userInfo);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    //@ts-ignore
    resolver: yupResolver(schema),
    defaultValues: {
      name: initialData?.name || '', 
      description: initialData?.description || '',
      price: initialData?.price || '',
      duration: initialData?.duration || '',
    },
  });

  const { mutate: postPaymentTypeMutation, isPending: posting } = useMutation({
    mutationFn: async (data: any) => {
        if (mode === "edit" && initialData) {
          //   return await updateFarmerHarvests(initialData.id, data);
        } else {
          return await postSystemPackage(data);
        }
    },
    onSuccess: () => {
      dispatch(
        addAlert({
            message:
              mode === 'edit'
                ? 'System package updated successfully!'
                : 'System package  added successfully!',
            title: mode === 'edit' ? 'Edit Success' : 'Add Success',
            type: 'success',
        })
      );
      queryClient.invalidateQueries({queryKey:['SystemPackages']})
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
      package_name: data.name,
      package_description: data.description,
      package_price: data.price,
      package_duration: data.duration,
      package_status: true,
      inserted_by: currentUser?.username,
      updated_by: currentUser?.username,
    };
    postPaymentTypeMutation(finalData);
  };

  return (
    <Modal
      title={mode === "edit" ? "Edit System Package" : "Add System Package"}
      open={true}
      onCancel={handleCancel}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label=""
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input {...field} placeholder="Package name" />
            )}
          />
        </Form.Item>
        <Form.Item
          label=""
          validateStatus={errors.description ? "error" : ""}
          help={errors.description?.message}
        >
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Input {...field} placeholder="Package description" />
            )}
          />
        </Form.Item>
        <Form.Item
          label=""
          validateStatus={errors.price ? "error" : ""}
          help={errors.price?.message}
        >
          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <Input {...field} placeholder="Package price" type="number" />
            )}
          />
        </Form.Item>
        <Form.Item
          label=""
          validateStatus={errors.duration ? "error" : ""}
          help={errors.duration?.message}
        >
          <Controller
            control={control}
            name="duration"
            render={({ field }) => (
              <Input {...field} placeholder="Package duration" type="number" />
            )}
          />
        </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={posting}
            className="font-bold bg-[#152033] text-white mt-4 w-full"
          >
             {mode === 'edit' ? 'Update System Package' : 'Create System Package'}
          </Button>
      </Form>
    </Modal>
  );
};

export default AddSystemPackage;
