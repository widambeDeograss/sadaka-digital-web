import { Form, Input, DatePicker, Button, Card, Row, Col } from "antd";
import { postMichango } from "../../helpers/ApiConnectors";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { addAlert } from "../../store/slices/alert/alertSlice";

const { TextArea } = Input;

const OngezaMchango = () => {
  const dispatch = useAppDispatch();
  const church = useAppSelector((state: any) => state.sp);
  const user = useAppSelector((state: any) => state.user.userInfo);
  const [form] = Form.useForm();

  const { mutate: postMchangoMutation, isPending: posting } = useMutation({
    mutationFn: async (data: any) => {
      const response = await postMichango(data);
      return response;
    },
    onSuccess: () => {
      dispatch(
        addAlert({
          title: "Success",
          message: "Contribution added successfully!",
          type: "success",
        })
      );
      form.resetFields();
    },
    onError: () => {
      dispatch(
        addAlert({
          title: "Error",
          message: "Failed to add Contribution.",
          type: "error",
        })
      );
    },
  });

  const onFinish = (values: any) => {
    const mchangoData = {
      target_amount: values.lengo,
      mchango_name: values.name,
      mchango_amount: values.amount,
      mchango_description: values.description,
      date: values.date.format("YYYY-MM-DD"),
      church: church?.id,
      inserted_by: user?.username,
      updated_by: user?.username,
    };

    postMchangoMutation(mchangoData);
  };

  return (
    <Card className="mb-10">
      <div className="mb-10">
        <div className="p-6 rounded-lg bg-white shadow-md">
          <h2 className="text-xl font-bold mb-6">Ongeza Mchango</h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="lengo"
                  label="Lengo (Tzs)"
                  rules={[{ required: true, message: "Lengo inahitajika" }]}
                >
                  <Input placeholder="Ingiza lengo" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="name"
                  label="Jina la Mchango"
                  rules={[{ required: true, message: "Jina la mchango linahitajika" }]}
                >
                  <Input placeholder="Ingiza jina la mchango" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="amount"
                  label="Kiasi"
                  rules={[{ required: true, message: "Kiasi kinahitajika" }]}
                >
                  <Input placeholder="Ingiza kiasi" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="date"
                  label="Tarehe"
                  rules={[{ required: true, message: "Tarehe inahitajika" }]}
                >
                  <DatePicker
                    className="w-full"
                    format="YYYY-MM-DD"
                    // disabledDate={(current) => current && current > dayjs().endOf("day")}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="Maelezo Mafupi kuhusu Mchango"
              rules={[{ required: true, message: "Maelezo yanahitajika" }]}
            >
              <TextArea rows={3} placeholder="Andika maelezo mafupi ya mchango" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={posting}
                className="bg-[#152033]"
              >
                Ongeza Mchango
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Card>
  );
};

export default OngezaMchango;
