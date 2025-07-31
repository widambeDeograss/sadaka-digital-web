import { useState } from "react";
import {
  Card,
  Table,
  DatePicker,
  Space,
  Button,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
  Tabs,
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import { useAppSelector } from "../../store/store-hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPaymentTypeTransfer,
  postPaymentTypeTransfer,
  updatePaymentTypeTransfer,
  deletePaymentTypeTransfer,
  fetchPayTypes,
} from "../../helpers/ApiConnectors";

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Text } = Typography;

interface TransferType {
  id: number;
  from_payment_type: { id: number; name: string };
  to_payment_type: { id: number; name: string };
  amount: number;
  transfer_date: string;
  created_by: string;
}

const toNumber = (value: any): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const num = parseFloat(value.replace(/[^0-9.-]/g, ""));
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

const PaymentTypeTransfers = ({
  paymentTypeId,
  initialStartDate,
  initialEndDate,
  revenueData,
}: {
  paymentTypeId: number;
  initialStartDate: string;
  initialEndDate: string;
  revenueData?: any; // Optional prop for revenue data
}) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<TransferType | null>(
    null
  );
  const [dateRange, setDateRange] = useState([
    dayjs(initialStartDate),
    dayjs(initialEndDate),
  ]);
  const [selectedToPaymentType, setSelectedToPaymentType] = useState<
    number | null
  >(null);
  const [activeTab, setActiveTab] = useState("outgoing");
  const church = useAppSelector((state: any) => state.sp);
  const queryClient = useQueryClient();

  // Fetch payment types for filters and form
  const { data: payTypes } = useQuery({
    queryKey: ["payTypes", church.id],
    queryFn: async () => {
      const response: any = await fetchPayTypes(`?church_id=${church.id}`);
      return response;
    },
  });

  // Fetch outgoing transfers (from this payment type)
  const { data: outgoingTransfers, isLoading: isOutgoingLoading } = useQuery({
    queryKey: [
      "outgoingTransfers",
      paymentTypeId,
      dateRange,
      selectedToPaymentType,
    ],
    queryFn: async () => {
      const params: any = {
        start_date: dateRange[0].format("YYYY-MM-DD"),
        end_date: dateRange[1].format("YYYY-MM-DD"),
      };
      //   if (selectedToPaymentType) {
      //     params.to_payment_type = selectedToPaymentType;
      //   }
      const urlString = `?from_payment_type=${paymentTypeId}&church_id=${church.id}&start_date=${params.start_date}&end_date=${params.end_date}`;
      const response: any = await fetchPaymentTypeTransfer(urlString);
      return response;
    },
  });

  console.log("Outgoing Transfers:", outgoingTransfers);

  // Fetch incoming transfers (to this payment type)
  const { data: incomingTransfers, isLoading: isIncomingLoading } = useQuery({
    queryKey: ["incomingTransfers", paymentTypeId, dateRange],
    queryFn: async () => {
      const params: any = {
        start_date: dateRange[0].format("YYYY-MM-DD"),
        end_date: dateRange[1].format("YYYY-MM-DD"),
      };
      const urlString = `?to_payment_type=${paymentTypeId}&church_id=${church.id}&start_date=${params.start_date}&end_date=${params.end_date}`;

      const response: any = await fetchPaymentTypeTransfer(urlString);
      return response;
    },
  });

  // Create transfer mutation
  const createTransferMutation = useMutation({
    mutationFn: postPaymentTypeTransfer,
    onSuccess: () => {
      message.success("Transfer created successfully");
      queryClient.invalidateQueries({ queryKey: ["outgoingTransfers"] });
      queryClient.invalidateQueries({ queryKey: ["incomingTransfers"] });
      setIsModalOpen(false);
      form.resetFields();
    },
    onError: () => {
      message.error("Error creating transfer");
    },
  });

  // Update transfer mutation
  const updateTransferMutation = useMutation({
    mutationFn: () =>
      updatePaymentTypeTransfer(editingTransfer?.id, form.getFieldsValue()),
    onSuccess: () => {
      message.success("Transfer updated successfully");
      queryClient.invalidateQueries({ queryKey: ["outgoingTransfers"] });
      queryClient.invalidateQueries({ queryKey: ["incomingTransfers"] });
      setIsModalOpen(false);
      setEditingTransfer(null);
      form.resetFields();
    },
    onError: () => {
      message.error("Error updating transfer");
    },
  });

  // Delete transfer mutation
  const deleteTransferMutation = useMutation({
    mutationFn: deletePaymentTypeTransfer,
    onSuccess: () => {
      message.success("Transfer deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["outgoingTransfers"] });
      queryClient.invalidateQueries({ queryKey: ["incomingTransfers"] });
    },
    onError: () => {
      message.error("Error deleting transfer");
    },
  });

  const handleDateChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    }
  };

  const handleToPaymentTypeChange = (value: number | null) => {
    setSelectedToPaymentType(value);
  };

  const handleCreateTransfer = () => {
    setEditingTransfer(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditTransfer = (record: TransferType) => {
    setEditingTransfer(record);
    form.setFieldsValue({
      to_payment_type: record.to_payment_type.id,
      amount: record.amount,
    });
    setIsModalOpen(true);
  };

  const handleDeleteTransfer = (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this transfer?",
      onOk: () => deleteTransferMutation.mutate(id),
    });
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const data = {
        ...values,
        church: church.id,
        created_by: "Current User",
        updated_by: "Current User",
      };

      if (editingTransfer) {
        updateTransferMutation.mutate({ id: editingTransfer.id, data });
      } else {
        createTransferMutation.mutate({
          ...data,
          from_payment_type: paymentTypeId,
        });
      }
    });
  };

  const calculateRemainingAmount = (paymentTypeId: number) => {
    if (!revenueData || !revenueData.revenue_summary) return 0;
    console.log("Revenue Data:", revenueData);

    const paymentType = revenueData.revenue_summary.find(
      (item: any) => item.payment_type__id == paymentTypeId
    );
    if (!paymentType) return 0;
    console.log("Payment Type:", paymentType);

    // Get outgoing transfers total (money sent from this payment type)
    const outgoingTotal =
      outgoingTransfers?.reduce((sum: number, transfer: any) => {
        const amount = toNumber(transfer.amount);
        console.log(
          `Adding outgoing amount: ${amount} (type: ${typeof transfer.amount})`
        );
        return sum + amount;
      }, 0) || 0;
    console.log("Outgoing Total:", outgoingTotal);

    // Get incoming transfers total (money received to this payment type)
    const incomingTotal =
      incomingTransfers?.reduce((sum: number, transfer: any) => {
        const amount = toNumber(transfer.amount);
        console.log(
          `Adding incoming amount: ${amount} (type: ${typeof transfer.amount})`
        );
        return sum + amount;
      }, 0) || 0;

    const originalAmount = toNumber(paymentType.total_amount);
    const outgoing = toNumber(outgoingTotal);
    const incoming = toNumber(incomingTotal);

    console.log(
      `Calculation for ${paymentTypeId}: ${originalAmount} + ${incoming} - ${outgoing}`
    );

    const remaining = originalAmount + incoming - outgoing;

    // Ensure we return a number (handle any potential NaN cases)
    return isNaN(remaining) ? 0 : remaining;
  };

  const commonColumns: TableColumnsType<TransferType> = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `Tsh ${amount.toLocaleString()}`,
    },
    {
      title: "Date",
      dataIndex: "transfer_date",
      key: "transfer_date",
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      key: "created_by",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEditTransfer(record)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteTransfer(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const outgoingColumns: TableColumnsType<TransferType> = [
    {
      title: "To Payment Type",
      dataIndex: ["to_payment_type", "name"],
      key: "to_payment_type",
      render: (_, record) => {
        const paymentType = payTypes?.find(
          (type: any) => type.id == record.to_payment_type
        );
        return paymentType ? paymentType.name : "Unknown";
      },
    },
    ...commonColumns,
  ];

  const incomingColumns: TableColumnsType<TransferType> = [
    {
      title: "From Payment Type",
      dataIndex: ["from_payment_type", "name"],
      key: "from_payment_type",
      render: (_, record) => {
        const paymentType = payTypes?.find(
          (type: any) => type.id == record.from_payment_type
        );
        return paymentType ? paymentType.name : "Unknown";
      },
    },
    ...commonColumns,
  ];

  return (
    <Card
      title={`Transfers for ${
        outgoingTransfers?.from_payment_type?.name || "Payment Type"
      }`}
      className="mt-4"
      loading={isOutgoingLoading || isIncomingLoading}
      extra={
        <Space>
          <RangePicker
            defaultValue={[dateRange[0], dateRange[1]]}
            onChange={handleDateChange}
          />
          {activeTab === "outgoing" && (
            <Select
              placeholder="Filter by recipient"
              style={{ width: 200 }}
              allowClear
              onChange={handleToPaymentTypeChange}
            >
              {payTypes?.map((type: any) => (
                <Select.Option key={type.id} value={type.id}>
                  {type.name}
                </Select.Option>
              ))}
            </Select>
          )}
          <Button type="primary" onClick={handleCreateTransfer}>
            Create Transfer
          </Button>
        </Space>
      }
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Outgoing Transfers" key="outgoing">
          <Table
            columns={outgoingColumns}
            dataSource={outgoingTransfers || []}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        <TabPane tab="Incoming Transfers" key="incoming">
          <Table
            columns={incomingColumns}
            dataSource={incomingTransfers || []}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>
      <Text className="mt-4 font-bold text-xl">
        JUMLA KUU: {calculateRemainingAmount(paymentTypeId).toLocaleString()}{" "}
        Tsh
      </Text>

      <Modal
        title={editingTransfer ? "Edit Transfer" : "Create Transfer"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        confirmLoading={
          createTransferMutation.isPending || updateTransferMutation.isPending
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="to_payment_type"
            label="To Payment Type"
            rules={[{ required: true, message: "Please select payment type" }]}
          >
            <Select placeholder="Select payment type">
              {payTypes
                ?.filter((type: any) => type.id !== paymentTypeId)
                .map((type: any) => (
                  <Select.Option key={type.id} value={type.id}>
                    {type.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: "Please enter amount" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={1000}
              //   formatter={(value) =>
              //     `Tsh ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              //   }
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default PaymentTypeTransfers;
