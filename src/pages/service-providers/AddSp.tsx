import { useState } from "react";
import { Button, Modal, Input, Select, Tabs, Form } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { fetchAllUsers, postSpSetup } from "../../helpers/ApiConnectors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "../../store/store-hooks";
import { addAlert } from "../../store/slices/alert/alertSlice";

type modalType = {
  openMOdal: any;
  handleCancel: any;
};

const ServiceProviderModal = ({ openMOdal, handleCancel }: modalType) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    church_name: Yup.string().required("Church name is required"),
    church_location: Yup.string().required("Church location is required"),
    church_email: Yup.string()
      .email("Enter a valid email")
      .required("Church email is required"),
    church_phone: Yup.string().required("Church phone is required"),
    church_category: Yup.string().required("Church category is required"),
    sp_admin: Yup.string().required("Service provider admin is required"),
    church_status: Yup.boolean().required("Status is required"),
  });

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response:any = await fetchAllUsers(`?query_type=sp_admins`);
      console.log(response);
      return response;
    },
    // {
    //   enabled: false,
    // }
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
    const finalData = {
      ...data,
      inserted_by: "admin",
      updated_by: "admin", 
    };
    const response:any = await postSpSetup(finalData);
   
    if (!response) {
       throw new Error("Failed to save SP, Try again later")   
    }
    return response;
  };


  const { mutate: addSpMutation, isPending: loading } = useMutation({
    mutationFn: onSubmit,
    onSuccess: (data) => {
      console.log(data);

      dispatch(
        addAlert({
          title: "Success",
          message: "SP added successfully",
          type: "success",
        })
      );
      
    //   navigate("/");
    },
    onError: (error) => {
      
      dispatch(
        addAlert({
          title: "Error adding SP",
          message: error.message,
          type: "error",
        })
      );
    //   enqueueSnackbar("Ops.. Error on error adding SPt. Try again!", {
    //     variant: "error",
    //   });
    },
  });


  return (
    <Modal
      title="New Service Provider"
      open={openMOdal}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={null}
      className="w-full"
      width={800} // Increasing modal size
    >
      <form onSubmit={handleSubmit(addSpMutation)}>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Church Details" key="1">
            <div className="grid grid-cols-2 gap-3">
              {/* Church Name */}
              <div className="">
                <label
                  htmlFor="church_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Church Name
                </label>
                <input
                  id="church_name"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.church_name ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("church_name")}
                />
                {errors.church_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.church_name?.message}
                  </p>
                )}
              </div>

              {/* Church Location */}
              <div className="">
                <label
                  htmlFor="church_location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Church Location
                </label>
                <input
                  id="church_location"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.church_location
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  {...register("church_location")}
                />
                {errors.church_location && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.church_location?.message}
                  </p>
                )}
              </div>

              {/* Church Email */}
              <div className="">
                <label
                  htmlFor="church_email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Church Email
                </label>
                <input
                  id="church_email"
                  type="email"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.church_email ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("church_email")}
                />
                {errors.church_email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.church_email?.message}
                  </p>
                )}
              </div>

              {/* Church Phone */}
              <div className="">
                <label
                  htmlFor="church_phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Church Phone
                </label>
                <input
                  id="church_phone"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.church_phone ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("church_phone")}
                />
                {errors.church_phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.church_phone?.message}
                  </p>
                )}
              </div>

              {/* Church Category */}
              <div className="">
                <label
                  htmlFor="church_category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Church Category
                </label>
                <input
                  id="church_category"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.church_category
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  {...register("church_category")}
                />
                {errors.church_category && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.church_category?.message}
                  </p>
                )}
              </div>

              <div>
              <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Admin
                  </label>
                  <select
                    id="sp_admin"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      errors.sp_admin ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("sp_admin")}
                  >
                    <option value="">Select Admin</option>
                   {users?.map((user:any) => {
                      return  <option value={user.id}>{user.username}</option>
                   })}
                  </select>
                  {errors.sp_admin && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.sp_admin?.message}
                    </p>
                  )}
                </div>

              {/* Church Status */}
              <div className="">
                <label
                  htmlFor="church_status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="church_status"
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50"
                  {...register("church_status")}
                  defaultValue="true"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                {errors.church_status && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.church_status?.message}
                  </p>
                )}
              </div>

           
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="font-bold bg-[#152033] text-white mt-8"
              style={{ width: "100%" }}
            >
              Add Service Provider
            </Button>
          </TabPane>
        </Tabs>
      </form>
    </Modal>
  );
};

export default ServiceProviderModal;
