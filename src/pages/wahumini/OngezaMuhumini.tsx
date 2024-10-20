import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { postWahumini, fetchtJumuiya } from "../../helpers/ApiConnectors"; // Make sure fetchJumuiyas is defined
import { useMutation, useQuery } from "@tanstack/react-query";
import { addAlert } from "../../store/slices/alert/alertSlice";
import { Form, Input, Select, Button, DatePicker, notification } from "antd";

const { Option } = Select;

const schema = yup.object().shape({
  first_name: yup.string().required("Jina la Kwanza ni lazima"),
  last_name: yup.string().required("Jina la Mwisho ni lazima"),
  email: yup.string().email("Barua pepe sio sahihi"),
  phone_number: yup.string()
    .matches(/^[0-9]+$/, "Nambari ya Simu inapaswa kuwa nambari")
    .required("Nambari ya Simu ni lazima"),
  gender: yup.string().oneOf(['male', 'female'], "Chagua jinsia sahihi").required("Jinsia ni lazima"),
  birthdate: yup.date(),
  address: yup.string(),
  marital_status: yup.string().required("Hali ya ndoa ni lazima"),
  jumuiya: yup.string().required("Jumuiya ni lazima"),
});

const OngezaMuhumini = () => {
  const dispatch = useAppDispatch();
  const church = useAppSelector((state: any) => state.sp);
  const user = useAppSelector((state: any) => state.user.userInfo);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { data: jumuiyas, isLoading: loadingJumuiyas } = useQuery({
    queryKey: ["jumuiya"],
    queryFn: async () => {
        const response:any = await fetchtJumuiya(`?church_id=${church.id}`);
        console.log(response);
        
      return response
    },
  });




  const { mutate: addMuhuminiMutation , isPending} = useMutation({
    mutationFn:  async (data: any) => {
        return await postWahumini(data);
      },
    onSuccess: (data) => {
      console.log(data);
      dispatch(addAlert({
        title: "Success",
        message: "Muhumini added successfully",
        type: "success",
      }));
      reset(); // Reset the form on successful submission
    },
    onError: (error) => {
      dispatch(addAlert({
        title: "Error adding muhumini",
        message: error.message,
        type: "error",
      }));
    },
  });

    // Form submit handler
    const onSubmit = async (data: any) => {
      if (!church) {
        notification.error({ message: "Church ID is missing. Please ensure you are associated with a church." });
        return;
      }
  
      if (data.birthdate) {
        const formattedDate = new Date(data.birthdate).toISOString().split('T')[0];
        data.birthdate = formattedDate;
      }
  
      const finalData = {
        ...data,
        church: church?.id,
        created_by: user?.username,
        updated_by: user?.username,
      };
  
      return addMuhuminiMutation(finalData); 
    };
  

  return (
    <div className="mx-auto bg-white p-8 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Ongeza Muhumini</h2>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* First Name */}
        <Form.Item
          label="Jina la Kwanza"
          required
          validateStatus={errors.first_name ? "error" : ""}
          help={errors.first_name?.message}
        >
          <Controller
            control={control}
            name="first_name"
            render={({ field }) => (
              <Input {...field} placeholder="Jina la Kwanza" />
            )}
          />
        </Form.Item>

        {/* Last Name */}
        <Form.Item
          label="Jina la Mwisho"
          required
          validateStatus={errors.last_name ? "error" : ""}
          help={errors.last_name?.message}
        >
          <Controller
            control={control}
            name="last_name"
            render={({ field }) => (
              <Input {...field} placeholder="Jina la Mwisho" />
            )}
          />
        </Form.Item>

        {/* Email */}
        <Form.Item
          label="Email"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
        >
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input type="email" {...field} placeholder="Email" />
            )}
          />
        </Form.Item>

        {/* Phone Number */}
        <Form.Item
          label="Nambari ya Simu"
          validateStatus={errors.phone_number ? "error" : ""}
          help={errors.phone_number?.message}
        >
          <Controller
            control={control}
            name="phone_number"
            render={({ field }) => (
              <Input {...field} placeholder="Nambari ya Simu" />
            )}
          />
        </Form.Item>

        {/* Gender */}
        <Form.Item
          label="Jinsia"
          required
          validateStatus={errors.gender ? "error" : ""}
          help={errors.gender?.message}
        >
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select {...field} placeholder="Chagua Jinsia">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
            )}
          />
        </Form.Item>

        {/* Gender */}
        <Form.Item
          label="Hali ya ndoa"
          required
          validateStatus={errors.marital_status ? "error" : ""}
          help={errors.marital_status?.message}
        >
          <Controller
            control={control}
            name="marital_status"
            render={({ field }) => (
              <Select {...field} placeholder="Chagua Jinsia">
                    <Option value="">Chagua Hali ya Ndoa</Option>
                <Option value="single">Single</Option>
                <Option value="married">Married</Option>
                <Option value="divorced">Divorced</Option>
                <Option value="widowed">Widowed</Option>
              </Select>
            )}
          />
        </Form.Item>

        {/* Birthdate */}
        <Form.Item
          label="Tarehe ya Kuzaliwa"
          validateStatus={errors.birthdate ? "error" : ""}
          help={errors.birthdate?.message}
        >
          <Controller
            control={control}
            name="birthdate"
            render={({ field }:any) => (
              <DatePicker {...field} placeholder="Tarehe ya Kuzaliwa"  className="w-full"/>
            )}
          />
        </Form.Item>

        {/* Address */}
        <Form.Item
          label="Mahali anapoishi"
          validateStatus={errors.address ? "error" : ""}
          help={errors.address?.message}
        >
          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <Input {...field} placeholder="Mahali anapoishi" />
            )}
          />
        </Form.Item>

        {/* Jumuiya */}
        <Form.Item
          label="Jumuiya"
          required
          validateStatus={errors.jumuiya ? "error" : ""}
          help={errors.jumuiya?.message}
        >
          <Controller
            control={control}
            name="jumuiya"
            render={({ field }) => (
              loadingJumuiyas ? (
                <Select loading placeholder="Loading..." />
              ) : (
                <Select {...field} placeholder="Chagua Jumuiya">
                  {jumuiyas?.map((jumuiya:any) => (
                    <Option key={jumuiya.id} value={jumuiya.id}>
                      {jumuiya.name}
                    </Option>
                  ))}
                </Select>
              )
            )}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full bg-[#152033]" loading={isPending}>
            Ongeza Muhumini
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OngezaMuhumini;
