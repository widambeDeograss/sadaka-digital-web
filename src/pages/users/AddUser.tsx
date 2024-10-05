import { useState } from "react";
import { Button, Modal, Select, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchRoles, postUserSetup } from "../../helpers/ApiConnectors";
import { useAppDispatch } from "../../store/store-hooks";
import { addAlert } from "../../store/slices/alert/alertSlice";

type modalType = {
  openModal: any;
  handleCancel: any;
};

const CreateUserModal = ({ openModal, handleCancel }: modalType) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useAppDispatch();

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    phone: Yup.string().required("Phone number is required"),
    password: Yup.string().required("Password is required"),
    role: Yup.string(),
    // .required("Role is required"), // Role field validation
    is_sp_admin: Yup.boolean(),
  });

  const {
    data: roles,
    isLoading: rolesLoading,
    error,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response: any = await fetchRoles();
      return response?.map((role: any) => ({
        name: role.role_name,
        value: role.id,
      }));
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
    const response:any = await postUserSetup(data);
   
    if (!response?.success) {
       throw new Error("Failed to save user, Try again later")   
    }
    return response;
  };

  
  const { mutate: addUserMutation, isPending: loading } = useMutation({
    mutationFn: onSubmit,
    onSuccess: (data) => {
      console.log(data);

      dispatch(
        addAlert({
          title: "Success",
          message: "User added successfully",
          type: "success",
        })
      );
    //   navigate("/");
    },
    onError: (error) => {
      
      dispatch(
        addAlert({
          title: "Error adding user",
          message: error.message,
          type: "error",
        })
      );
    //   enqueueSnackbar("Ops.. Error on error adding usert. Try again!", {
    //     variant: "error",
    //   });
    },
  });

  return (
    <div>
      <Modal
        title={"Create User"}
        open={openModal}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={null}
        className="w-full max-w-4xl" // Increased modal size
      >
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="User Details" key="1">
            <form onSubmit={handleSubmit(addUserMutation)}>
              <div className="grid grid-cols-2 gap-3">
                {/* Username */}
                <div className="">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.username?.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email?.message}
                    </p>
                  )}
                </div>

                {/* First Name */}
                <div className="">
                  <label
                    htmlFor="firstname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    id="firstname"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      errors.firstname ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("firstname")}
                  />
                  {errors.firstname && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstname?.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="">
                  <label
                    htmlFor="lastname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      errors.lastname ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("lastname")}
                  />
                  {errors.lastname && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastname?.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone?.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password?.message}
                    </p>
                  )}
                </div>

                {/* Role Select */}
                <div className="">
                  <label htmlFor="role" className="block text-sm font-medium">
                    Role
                  </label>
                  <Select
                    id="role"
                    className={`${errors.role ? "border-red-500" : ""}`}
                    {...register("role")}
                    style={{ width: "100%" }}
                  >
                    {roles?.map((role: any) => (
                      <Select.Option key={role.id} value={role.value}>
                        {role.name}
                      </Select.Option>
                    ))}
                  </Select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                {/* SP Admin Checkbox */}
                <div className="col-span-2">
                 
               <div className="flex items-center gap-2">
               <input
                    id="is_sp_admin"
                    type="checkbox"
                    className=""
                    {...register("is_sp_admin")}
                  />
                   <label
                    htmlFor="is_sp_admin"
                    className="block text-sm font-medium text-gray-700"
                  >
                    SP Admin
                  </label>
               </div>
                  {errors.is_sp_admin && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.is_sp_admin?.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="font-bold bg-[#152033] text-white mt-4"
                style={{ width: "100%" }}
              >
                Create User
              </Button>
            </form>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default CreateUserModal;
