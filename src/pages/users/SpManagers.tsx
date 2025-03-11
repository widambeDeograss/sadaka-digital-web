import { useState } from "react";
import { Button, Modal, Select, Input, Form } from "antd";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchRoles, fetchtJumuiya, fetchWahumini, postSpManagers } from "../../helpers/ApiConnectors";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { addAlert } from "../../store/slices/alert/alertSlice";

const { Option } = Select;

type modalType = {
  openModal: boolean;
  handleCancel: () => void;
};
Select
// user_data = {
//   "username": request.data.get("username"),
//   "email":request.data.get('email'),
//   "first_name": request.data.get("first_name"),
//   "last_name": request.data.get("last_name"),
//   "full_name": request.data.get("full_name"),
//   "phone": request.data.get("phone_number"),
//   "password": request.data.get("password"),
//   "is_sp_manager":True,
//   "role": request.data.get("role"),
// }

// manager_data = {
//   "church": request.data.get("church"),
//   "inserted_by": request.data.get("inserted_by"),
//   "updated_by": request.data.get("updated_by"),
//   "active": request.data.get("active", True),
// }
const CreateUserModal = ({ openModal, handleCancel }: modalType) => {
  const [selectedJumuiya, setSelectedJumuiya] = useState(null);
  const dispatch = useAppDispatch();
  const church = useAppSelector((state: any) => state.sp);
  const user = useAppSelector((state: any) => state.user.userInfo);

   const { data: jumuiyas, isLoading: loadingJumuiyas } = useQuery({
     queryKey: ["jumuiya"],
     queryFn: async () => {
         const response:any = await fetchtJumuiya(`?church_id=${church.id}`);       
       return response
     },
   });

   console.log(selectedJumuiya);
   
 

 const {
    data: wahumini,
    isLoading,
  } = useQuery({
    queryKey: ["wahumini", selectedJumuiya],
    queryFn: async () => {
      const response: any = await fetchWahumini(`?jumuiya=${selectedJumuiya}`);
      return response;
    },
    
      enabled: selectedJumuiya ? true : false,
  });


  const {
    data: roles,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response: any = await fetchRoles();
      const filtered =  response?.filter((role: any) => role.role_name !== "SYSTEM_TOP_ADMIN");
      return filtered?.map((role: any) => ({
        name: role.role_name,
        value: role.id,
      }));
    },
    // {
    //   enabled: false,
    // }
  });

  // Mutation to add user
  const { mutate: addUserMutation, isPending: loading } = useMutation({
    mutationFn: async (data: any) => await postSpManagers(data),
    onSuccess: () => {
      dispatch(
        addAlert({
          title: "Success",
          message: "User added successfully",
          type: "success",
        })
      );
      handleCancel();
    },
    onError: (error) => {
      dispatch(
        addAlert({
          title: "Error",
          message: error.message,
          type: "error",
        })
      );
    },
  });

  const onFinish = (values: any) => {
    const mhumini =  wahumini?.find((mhumini: any) => mhumini.id === values.mhumini);
    const finalData = {
     username: mhumini?.first_name?.toLocaleLowerCase() + mhumini?.last_name?.toLocaleLowerCase(),
     first_name: mhumini?.first_name?.toLocaleLowerCase() ,
     last_name:mhumini?.last_name?.toLocaleLowerCase(),
     full_name:mhumini?.first_name + mhumini?.last_name,
     email: mhumini?.email ?  mhumini?.email : `${mhumini?.first_name + mhumini?.last_name}@bmcmakabe.org.tz`?.toLocaleLowerCase(),
     phone: mhumini?.phone_number,
     password:values?.password,
     role:values?.role,
      church: church.id,
      inserted_by: user?.username,
      updated_by: user?.username,
    };

    console.log(finalData);
    
    addUserMutation(finalData);
  };

  return (
    <Modal title="Create User" open={openModal} onCancel={handleCancel} footer={null}>
      <Form layout="vertical" onFinish={onFinish}>
        {/* Jumuiya Select */}
        <Form.Item name="jumuiya" label="Jumuiya" rules={[{ required: true, message: "Please select a Jumuiya" }]} > 
          <Select placeholder="Select Jumuiya" onChange={setSelectedJumuiya} loading={loadingJumuiyas}
           optionFilterProp="children"
           showSearch
           filterOption={(input, option) =>
             (option?.children?.toString() || '')
               .toLowerCase()
               .includes(input.toLowerCase())
           }
           notFoundContent="Hajapatikana"
          >
            {jumuiyas?.map((jumuiya: any) => (
              <Option key={jumuiya.id} value={jumuiya.id}>{jumuiya.name}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Mhumini Select */}
        <Form.Item name="mhumini" label="Mhumini" rules={[{ required: true, message: "Please select a Mhumini" }]}> 
          <Select placeholder="Select Mhumini" disabled={!selectedJumuiya} loading={isLoading}
           optionFilterProp="children"
           showSearch
           filterOption={(input, option) =>
             (option?.children?.toString() || '')
               .toLowerCase()
               .includes(input.toLowerCase())
           }
           notFoundContent="Hajapatikana"
          >
            {wahumini?.map((mhumini: any) => (
              <Option key={mhumini.id} value={mhumini.id}>{mhumini.first_name} {mhumini.last_name}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Role Select */}
        <Form.Item name="role" label="Role" rules={[{ required: true, message: "Please select a role" }]}> 
          <Select placeholder="Select Role">
            {roles?.map((role: any) => (
              <Option key={role.value} value={role.value}>{role.name}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Password Input */}
        <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please enter a password" }]}> 
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Button type="default" htmlType="submit" loading={loading} style={{ width: "100%" }}>
          Create User
        </Button>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
