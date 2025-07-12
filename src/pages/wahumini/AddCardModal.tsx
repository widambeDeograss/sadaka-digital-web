import { Modal, Button, Input, Form, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchWahumini, postBahasha } from "../../helpers/ApiConnectors";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { addAlert } from "../../store/slices/alert/alertSlice";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const { Option } = Select;

const CreateCardNumberModal = ({ visible, onClose }: any) => {
  const church = useAppSelector((state: any) => state.sp);
  const user = useAppSelector((state: any) => state.user.userInfo);
  const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
      }, 500); // 500ms debounce
    
      return () => clearTimeout(timeout);
    }, [searchTerm]);

  const schema = yup.object().shape({
    mhumini: yup.string().required("Mhumini is required."),
    card_no: yup.string().required("Card number is required."),
    bahasha_type: yup.string().required("Bahasha type is required."),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { data: wahumini, isLoading: loadingWahumini } = useQuery({
    queryKey: ['wahumini', debouncedSearchTerm],
    queryFn: async () => {
      const response: any = await fetchWahumini(`?church_id=${church?.id}&search=${debouncedSearchTerm}`);
      return response?.results || []; 
    },
    enabled: !!church?.id,
  });

  const onSubmit = async (data: any) => {
    if (!church) {
      toast.error(
        "Church ID is missing. Please ensure you are associated with a church."
      );
      return;
    }

    const finalData = {
      mhumini: data.mhumini,
      card_no: data.card_no,
      bahasha_type: data.bahasha_type,
      church: church?.id,
      created_by: user?.username,
      updated_by: user?.username,
    };

     await addBahashaMutation(finalData);
    // if (!response) {
    //   dispatch(
    //     addAlert({
    //       title: "Error adding Bahasha",
    //       message: "Error adding Bahasha.",
    //       type: "error",
    //     })
    //   );
    // } else {
    //   dispatch(
    //     addAlert({
    //       title: "Success",
    //       message: "Bahasha added successfully",
    //       type: "success",
    //     })
    //   );
    //   reset(); // Clear the form
    //   onClose(); // Close the modal
    // }
  };

  const { mutate: addBahashaMutation, isPending: loading } = useMutation({
    mutationFn: async (finalData:any) => {
      const response = await postBahasha(finalData);
      return response;
    },
    onSuccess: () => {
      dispatch(
        addAlert({
          title: "Success",
          message: "Bahasha added successfully",
          type: "success",
        })
      );
    },
    onError: (_error) => {
      dispatch(
        addAlert({
          title: "Error adding Bahasha",
          message:  "Error adding Bahasha",
          type: "error",
        })
      );
    },
  });

  return (
    <Modal
      title="Ongeza Namba ya Kadi"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Mhumini"
          validateStatus={errors.mhumini ? "error" : ""}
          help={errors.mhumini?.message}
        >
    
            <Controller
              control={control}
              name="mhumini"
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Chagua Mhumini"
                  onSearch={(value) => setSearchTerm(value)} 
                  filterOption={false} 
                  notFoundContent="Hajapatikana"
                  loading={loadingWahumini}
                >
                  {wahumini?.map((item: any) => (
                    <Option key={item.id} value={item.id}>
                      {item.first_name} {item.last_name}
                    </Option>
                  ))}
                </Select>
              )}
            />
      
        </Form.Item>

        <Form.Item
          label="Namba ya Kadi"
          validateStatus={errors.card_no ? "error" : ""}
          help={errors.card_no?.message}
        >
          <Controller
            control={control}
            name="card_no"
            render={({ field }) => (
              <Input {...field} placeholder="Ingiza Namba ya Kadi" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Aina ya Bahasha"
          validateStatus={errors.bahasha_type ? "error" : ""}
          help={errors.bahasha_type?.message}
        >
          <Controller
            control={control}
            name="bahasha_type"
            render={({ field }) => (
              <Select {...field} placeholder="Chagua Aina ya Bahasha">
                <Option value="zaka">Zaka</Option>
                <Option value="sadaka">Sadaka</Option>
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="font-bold bg-[#152033] text-white mt-4"
          >
            Ongeza Kadi
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCardNumberModal;
