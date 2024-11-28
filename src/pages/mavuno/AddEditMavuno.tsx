import React, { useState, useEffect } from "react";
import { 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  message, 
  Button 
} from "antd";
// import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchtJumuiya, 
  postMavuno, 
  updateMavuno 
} from "../../helpers/ApiConnectors";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { addAlert } from "../../store/slices/alert/alertSlice";
import _debounce from 'lodash/debounce';

type ModalProps = {
  openModal: boolean;
  handleCancel: () => void;
  editData?: any;
};

type MavunoPostRequest = {
  jumuiya?: number;
  name: string;
  description: string;
  church: number;
  year_target_amount: number;
  collected_amount: number;
  status: boolean;
  inserted_by: string;
  updated_by: string;
};

const OngezaMavuno: React.FC<ModalProps> = ({ 
  openModal, 
  handleCancel, 
  editData 
}) => {
  const [form] = Form.useForm();
  const church = useAppSelector((state: any) => state.sp);
  const user = useAppSelector((state: any) => state.user.userInfo);
  const dispatch = useAppDispatch();

  // State for Jumuiya search
  const [_jumuiyaSearch, setJumuiyaSearch] = useState<string>("");
  const [jumuiyaOptions, setJumuiyaOptions] = useState<any[]>([]);
  const [fetchingJumuiya, setFetchingJumuiya] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Debounced Jumuiya search
  const debouncedSearch = React.useMemo(
    () => _debounce(async (search: string) => {
      if (!search) {
        setJumuiyaOptions([]);
        return;
      }
      try {
        setFetchingJumuiya(true);
        const response:any = await fetchtJumuiya(`?church_id=${church.id}&&search=${search}`);
        setJumuiyaOptions(response);
      } catch (error) {
        message.error("Imeshindwa kupata Jumuiya");
      } finally {
        setFetchingJumuiya(false);
      }
    }, 500),
    [church.id]
  );

  // Handle Jumuiya search input
  const handleJumuiyaSearch = (value: string) => {
    setJumuiyaSearch(value);
    debouncedSearch(value);
  };

  // Validation schema
//   const validationSchema = Yup.object().shape({
//     jumuiya: Yup.number()
//       .typeError("Jumuiya lazima ichaguliwe")
//       .required("Jumuiya inahitajika"),
//     name: Yup.string()
//       .required("Jina la Mavuno linahitajika")
//       .max(300, "Jina la Mavuno liwe na herufi zisizozidi 300"),
//     description: Yup.string()
//       .required("Maelezo yanahitajika"),
//     year_target_amount: Yup.number()
//       .typeError("Kiasi cha lengo lazima kiwe namba")
//       .required("Kiasi cha lengo kinahitajika")
//       .positive("Kiasi cha lengo lazima kiwe namba ya kushuka")
//       .min(0, "Kiasi cha lengo lazima kiwe zaidi ya 0"),
//   });

  // Mutation for posting/updating Mavuno
  const { mutate: saveMavunoMutation, isPending: saving } = useMutation({
    mutationFn: async (data: MavunoPostRequest) => {
      if (editData) {
        // Update existing Mavuno
        return await updateMavuno(editData.id, data);
      }
      // Create new Mavuno
      return await postMavuno(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mavuno"] });
      dispatch(
        addAlert({
          title: "Mafanikio",
          message: editData 
            ? "Mavuno imebadilishwa vizuri!" 
            : "Mavuno imeongezwa vizuri!",
          type: "success",
        })
      );
      message.success(
        editData 
          ? "Mavuno imebadilishwa vizuri!" 
          : "Mavuno imeongezwa vizuri!"
      );
      handleCancel();
      form.resetFields();
    },
    onError: (_error: any) => {
      dispatch(
        addAlert({
          title: "Hitilafu",
          message: editData 
            ? "Imeshindwa kubadilisha Mavuno." 
            : "Imeshindwa kuongeza Mavuno.",
          type: "error",
        })
      );
      message.error(
        editData 
          ? "Imeshindwa kubadilisha Mavuno." 
          : "Imeshindwa kuongeza Mavuno."
      );
    },
  });

  // Handle form submission
  const onFinish = (values: any) => {
    const finalData: MavunoPostRequest = {
      jumuiya: values.jumuiya,
      name: values.name,
      description: values.description,
      church: church?.id,
      year_target_amount: values.year_target_amount,
      collected_amount: editData ? editData.collected_amount : 0,
      status: true,
      inserted_by: user?.username,
      updated_by: user?.username,
    };

    saveMavunoMutation(finalData);
  };

  // Populate form when editing
  useEffect(() => {
    if (editData && openModal) {
      form.setFieldsValue({
        jumuiya: editData.jumuiya?.id,
        name: editData.name,
        description: editData.description,
        year_target_amount: editData.year_target_amount,
      });
    } else if (!editData) {
      form.resetFields();
    }
  }, [editData, openModal, form]);

  return (
    <Modal
      title={editData ? "Badilisha Mavuno" : "Ongeza Mavuno"}
      open={openModal}
      onCancel={handleCancel}
      footer={null}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        {/* Jumuiya Select with Search */}
        <Form.Item
          name="jumuiya"
          label="Jumuiya"
          rules={[{ 
            required: true, 
            message: "Jumuiya inahitajika" 
          }]}
        >
          <Select
            showSearch
            placeholder="Tafuta Jumuiya"
            // fetchOptions
            filterOption={false}
            onSearch={handleJumuiyaSearch}
            loading={fetchingJumuiya}
            options={jumuiyaOptions.map((jumuiya) => ({
              value: jumuiya.id,
              label: jumuiya.name,
            }))}
          />
        </Form.Item>

        {/* Mavuno Name */}
        <Form.Item
          name="name"
          label="Jina la Mavuno"
          rules={[
            { 
              required: true, 
              message: "Jina la Mavuno linahitajika" 
            },
            {
              max: 300,
              message: "Jina la Mavuno liwe na herufi zisizozidi 300"
            }
          ]}
        >
          <Input 
            placeholder="Ingiza jina la Mavuno"
          />
        </Form.Item>

        {/* Target Amount */}
        <Form.Item
          name="year_target_amount"
          label="Lengo la Mavuno (Tzs)"
          rules={[
            { 
              required: true, 
              message: "Kiasi cha lengo kinahitajika" 
            },
            {
              type: 'number',
              min: 0,
              message: "Kiasi cha lengo lazima kiwe zaidi ya 0"
            }
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value ? parseFloat(value.replace(/\$\s?|(,*)/g, '')) : 0}
            placeholder="Ingiza lengo la Mavuno"
          />
        </Form.Item>

        {/* Description */}
        <Form.Item
          name="description"
          label="Maelezo"
          rules={[{ 
            required: true, 
            message: "Maelezo yanahitajika" 
          }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Andika maelezo ya Mavuno"
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={saving}
            block
            className="bg-[#152033] text-white"
          >
            {editData ? "Badilisha" : "Ongeza"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OngezaMavuno;