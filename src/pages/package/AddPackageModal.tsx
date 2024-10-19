import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addAlert } from "../../store/slices/alert/alertSlice";
import { postSpPackage, fetchSps, fetchSystemPackage, fetchSystemPackageOffer } from "../../helpers/ApiConnectors";
import { Button, Form, Modal, Select, DatePicker, InputNumber, Checkbox } from "antd";
import moment from "moment";

interface AddEditPackage {
  mode: "add" | "edit";
  initialData: {
    id: number;
    package: number;
    church: number;
    package_offer: number;
    is_active: boolean;
    payed_amount: number;
    package_start_date: string;
    package_end_date: string;
  };
  handleCancel: () => void;
}

const schema = yup.object().shape({
  package: yup.number().required("Package is required"),
  church: yup.number().required("Church is required"),
  package_offer: yup.number().required("Package offer is required"),
  payed_amount: yup.number().required("Paid amount is required"),
  package_start_date: yup.date().required("Start date is required"),
  package_end_date: yup.date().required("End date is required"),
  is_active:yup.boolean()
});

const AddPackage = ({
  mode,
  initialData,
  handleCancel,
}: AddEditPackage) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const currentUser = useAppSelector((state: any) => state?.user.userInfo);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    
    defaultValues: {
      payed_amount: initialData?.payed_amount || 0,
      //@ts-ignore
      package_start_date: initialData?.package_start_date ? moment(initialData.package_start_date) : null,
      //@ts-ignore
      package_end_date: initialData?.package_end_date ? moment(initialData.package_end_date) : null,
      is_active: initialData?.is_active || false,
    },
  });

  const {
    data: churches,
  } = useQuery({
    queryKey: ["sps"],
    queryFn: async () => {
      const response:any = await fetchSps();
      console.log(response);
      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  // Fetch options for select dropdowns
    const { data: systemPackages, isLoading: loadingSystemPackages } = useQuery({
      queryKey: ["SystemPackages"],
      queryFn: async () => {
        const response: any = await fetchSystemPackage();
        return response;
      },
    });
  
      // Fetch options for select dropdowns
      const { data: systemOffers,  } = useQuery({
        queryKey: ["systemOffers"],
        queryFn: async () => {
          const response: any = await fetchSystemPackageOffer();
          return response;
        },
      });

  const { mutate: postPackageMutation, isPending: posting } = useMutation({
    mutationFn: async (data: any) => {
      if (mode === "edit" && initialData) {
        // Update package logic here
      } else {
        return await postSpPackage(data);
      }
    },
    onSuccess: () => {
      dispatch(
        addAlert({
          message:
            mode === 'edit'
              ? 'Package updated successfully!'
              : 'Package added successfully!',
          title: mode === 'edit' ? 'Edit Success' : 'Add Success',
          type: 'success',
        })
      );
      queryClient.invalidateQueries({queryKey:['spPackages']});
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
      package_status: data.is_active,
      inserted_by: currentUser?.username,
      updated_by: currentUser?.username,
    };
    postPackageMutation(finalData);
  };

  return (
    <Modal
      title={mode === "edit" ? "Edit Package" : "Add Package"}
      open={true}
      onCancel={handleCancel}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Package"
          validateStatus={errors.package ? "error" : ""}
          help={errors.package?.message}
        >
          <Controller
            control={control}
            name="package"
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select Package"
                options={systemPackages?.map((pkg: any) => ({
                  value: pkg.id,
                  label: pkg.package_name,
                }))}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Church"
          validateStatus={errors.church ? "error" : ""}
          help={errors.church?.message}
        >
          <Controller
            control={control}
            name="church"
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select Church"
                options={churches?.map((church: any) => ({
                  value: church.id,
                  label: church.church_name,
                }))}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Package Offer"
          validateStatus={errors.package_offer ? "error" : ""}
          help={errors.package_offer?.message}
        >
          <Controller
            control={control}
            name="package_offer"
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select Package Offer"
                options={systemOffers?.map((offer: any) => ({
                  value: offer.id,
                  label: offer.offer_name,
                }))}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Paid Amount"
          validateStatus={errors.payed_amount ? "error" : ""}
          help={errors.payed_amount?.message}
        >
          <Controller
            control={control}
            name="payed_amount"
            
            render={({ field }) => (
              <InputNumber {...field} placeholder="Paid Amount"  className="w-full"/>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Package Start Date"
          validateStatus={errors.package_start_date ? "error" : ""}
          help={errors.package_start_date?.message}
        >
          <Controller
            control={control}
            name="package_start_date"
            render={({ field }:any) => (
              <DatePicker {...field} format="YYYY-MM-DD" className="w-full"/>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Package End Date"
          validateStatus={errors.package_end_date ? "error" : ""}
          help={errors.package_end_date?.message}
        >
          <Controller
            control={control}
            name="package_end_date"
            render={({ field }:any) => (
              <DatePicker {...field} format="YYYY-MM-DD" className="w-full" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Is Active"
          validateStatus={errors.is_active ? "error" : ""}
          help={errors.is_active?.message}
        >
          <Controller
            control={control}
            name="is_active"
            render={({ field }) => (
              <Checkbox {...field} checked={field.value}>Active</Checkbox>
            )}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={posting}
          className="font-bold bg-[#152033] text-white mt-4 w-full"
        >
          {mode === 'edit' ? 'Update Package' : 'Create Package'}
        </Button>
      </Form>
    </Modal>
  );
};

export default AddPackage;
