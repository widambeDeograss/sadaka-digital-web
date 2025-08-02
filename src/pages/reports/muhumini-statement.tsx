import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Table, Typography, DatePicker, Select, Button, Form, Divider, Radio } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../store/store-hooks';
import { fetchtJumuiya, fetchWahumini,fetchWahuminiStatement, retrieveMuumini, sendCustomSms } from '../../helpers/ApiConnectors';
import { addAlert } from '../../store/slices/alert/alertSlice';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface Contribution {
  contribution_type: string;
  contribution_detail: string;
  year: number;
  month: string;
  total_amount: number;
  contribution_count: number;
}

interface MuhuminiStatement {
  mhumini_id: number;
  first_name: string;
  last_name: string;
  jumuiya_name: string;
  kanda_name: string;
  contributions: Contribution[];
  grand_total: string;
}

const MuhuminiStatementPage = () => {
  const church = useAppSelector((state:any) => state.sp);
  const [selectedMuhumini, setSelectedMuhumini] = useState<number | null>(null);
  const [selectedJumuiya, setSelectedJumuiya] = useState<number | null>(null);
  const [dates, setDates] = useState<[Dayjs, Dayjs]>([dayjs().subtract(1, 'month'), dayjs()]);
  const [statementData, setStatementData] = useState<MuhuminiStatement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
   const [messageType, setMessageType] = useState<'single' | 'jumuiya' | 'all'>('single');
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState<string>(''); 
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');


  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce
  
    return () => clearTimeout(timeout);
  }, [searchTerm]);
  
  

  const { data: wahumini, isLoading: loadingWahumini } = useQuery({
    queryKey: ['wahumini', debouncedSearchTerm],
    queryFn: async () => {
      const response: any = await fetchWahumini(`?church_id=${church?.id}&search=${debouncedSearchTerm}`);
      return response?.results || []; 
    },
    enabled: !!church?.id,
  });


  const { data: jumuiyas, isLoading: loadingJumuiyas } = useQuery({
    queryKey: ["jumuiya"],
    queryFn: async () => {
      const response: any = await fetchtJumuiya(`?church_id=${church.id}`);
      return response;
    }
  });


  const { data: record } = useQuery({
    queryKey: ['record', selectedMuhumini],
    queryFn: async () => {
         const response: any = await retrieveMuumini(selectedMuhumini);
         return response;
    },

    // enabled: !selectedMuhumini,
  });

  console.log(record);

 const sendPushMessage = async (message: string, phone?: string, jumuiyaId?: number, sendToAll?: boolean) => {
    try {
      setIsLoading(true);

      let postMessage: any;
      if (sendToAll) {
        postMessage = await sendCustomSms({
          all: true,
          message: message,
        });
      } else if (jumuiyaId) {
        postMessage = await sendCustomSms({
          jumuiya_id: jumuiyaId,
          message: message,
        });
      } else {
        postMessage = await sendCustomSms({
          phone: phone,
          message: message,
        });
      }

      if (postMessage?.message?.includes("Message sent successfully")) {
        dispatch(
          addAlert({
            title: "Ujumbe umetumwa kwa usahihi",
            message: `Ujumbe umetumwa kwa ${sendToAll ? 'wahumini wote' : jumuiyaId ? 'jumuiya nzima' : 'muumini'}`,
            type: "success",
          })
        );
      }
    } catch (error) {
      dispatch(
        addAlert({
          title: "Ujumbe haujatuma, jaribu tena baadaye",
          message: "Ujumbe haujatuma, jaribu tena baadaye",
          type: "error",
        })
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch statement handler
  const handleGetStatement = async () => {
    if (!selectedMuhumini) return;

    try {
      const response = await fetchWahuminiStatement(
        {
            church_id: church.id,
            muhumini_id: selectedMuhumini,
            start_date: dates[0].format('YYYY-MM-DD'),
            end_date: dates[1].format('YYYY-MM-DD'),
          }
      )   

      console.log(response);
      

      setStatementData(response.data[0]);
    } catch (error) {
      console.error('Error fetching statement:', error);
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Aina ya Mchango',
      dataIndex: 'contribution_type',
      key: 'contribution_type',
    },
    {
      title: 'Maelezo',
      dataIndex: 'contribution_detail',
      key: 'contribution_detail',
    },
    {
      title: 'Mwezi',
      dataIndex: 'month',
      key: 'month',
      render: (text: string) => text.trim(),
    },
    {
      title: 'Mwaka',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Kiasi (Tsh)',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount: number) => amount.toLocaleString(),
    },
    {
      title: 'Idadi ya Michango',
      dataIndex: 'contribution_count',
      key: 'contribution_count',
    },
  ];

const handleSendMessage = async (values: { message: string }) => {
    if (messageType === 'all') {
      await sendPushMessage(values.message, undefined, undefined, true);
    } else if (messageType === 'jumuiya') {
      if (!selectedJumuiya) {
        dispatch(
          addAlert({
            title: "Tafadhali chagua jumuiya",
            message: "Unahitaji kuchagua jumuiya kabla ya kutuma ujumbe",
            type: "error",
          })
        );
        return;
      }
      await sendPushMessage(values.message, undefined, selectedJumuiya);
    } else {
      if (!record?.phone_number) {
        dispatch(
          addAlert({
            title: "Namba ya simu haipo",
            message: "Hakuna namba ya simu ya muumini huyu",
            type: "error",
          })
        );
        return;
      }
      await sendPushMessage(values.message, record.phone_number);
    }
  };

  return (
    <Card className="mt-14">
      <Title level={4}>RIPOTI YA MUUMINI</Title>

      <div className="flex gap-4 mb-6 flex-wrap table-responsive">
        <div className="flex-1 min-w-[300px]">
          <Select
            placeholder="Chagua Muumini"
            className="w-full"
            loading={loadingWahumini}
            onChange={(value) => setSelectedMuhumini(value)}
            showSearch
            optionFilterProp="children"
            onSearch={(value) => setSearchTerm(value)} 
            filterOption={(input, option) =>
                (option?.children?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
              }
          >
            {wahumini?.map((m: any) => (
              <Option key={m.id} value={m.id}>
                {m.first_name} {m.last_name} - {m.jumuiya_details?.name} ({m.phone_number})
              </Option>
            ))}
          </Select>
        </div>

        <div className="flex-1 min-w-[300px]">
          <RangePicker
            value={dates}
            // @ts-ignore
            onChange={(values) => values && setDates(values)}
            format="YYYY-MM-DD"
            className="w-full"
          />
        </div>

        <Button
          type="primary"
            className="bg-[#152033] text-white"
          onClick={handleGetStatement}
          disabled={!selectedMuhumini}
        >
          Tafuta Ripoti
        </Button>
      </div>

      {
        !statementData && (
          <div className="flex justify-center mt-8">
            No data found
          </div>
        )
      }

      {statementData && (
        <div className="mt-8">
          <div className="mb-6">
            <Title level={5}>
              Jina: {statementData.first_name} {statementData.last_name}
            </Title>
            <p>Jumuiya: {statementData.jumuiya_name}</p>
            <p>Kanda: {statementData.kanda_name}</p>
          </div>
          <div className="table-responsive">
          <Table
            columns={columns}
            dataSource={statementData.contributions}
            rowKey={(record) => `${record.contribution_type}-${record.contribution_detail}`}
            pagination={false}
            bordered
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4}>
                    <strong>Jumla</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <strong>{Number(statementData.grand_total).toLocaleString()}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <strong>
                      {statementData.contributions.reduce(
                        (sum, item) => sum + item.contribution_count, 0
                      )}
                    </strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
          </div>

          <div className="mt-4 text-right">
            <p className="font-bold">
              Jumla: Tsh {Number(statementData.grand_total).toLocaleString()}
            </p>
            <p>
              Tarehe: {dayjs(dates[0]).format('DD/MM/YYYY')} -{' '}
              {dayjs(dates[1]).format('DD/MM/YYYY')}
            </p>
          </div>

         
        </div>
      )}


      <Divider />
           <Divider />

      <div className="mt-8">
        <Title level={5}>Tuma Ujumbe</Title>
        
        <Radio.Group 
          onChange={(e) => setMessageType(e.target.value)} 
          value={messageType}
          className="mb-4"
        >
          <Radio value="single">Muumini mmoja</Radio>
          <Radio value="jumuiya">Jumuiya</Radio>
          <Radio value="all">Wauumini wote</Radio>
        </Radio.Group>

        {messageType === 'single' && record && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p><strong>Muumini:</strong> {record?.first_name} {record?.last_name}</p>
            <p><strong>Simu:</strong> {record?.phone_number}</p>
          </div>
        )}

        {messageType === 'jumuiya' && (
          <div className="mb-4">
            <Select
              placeholder="Chagua Jumuiya"
              className="w-full"
              loading={loadingJumuiyas}
              onChange={(value) => setSelectedJumuiya(value)}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
           {jumuiyas?.map((jumuiya: any) => (
                    <Option key={jumuiya.id} value={jumuiya.id}>
                      {jumuiya.name}
                    </Option>
                  ))}
            </Select>
          </div>
        )}

        <Form
          onFinish={handleSendMessage}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            label="Ujumbe"
            name="message"
            rules={[{ required: true, message: 'Ujumbe ni lazima!' }]}
          >
            <textarea className="w-full h-32 p-2 border rounded-lg" placeholder="Andika ujumbe hapa..." />
          </Form.Item>

          <Button 
            type="primary" 
            htmlType="submit" 
            className="bg-[#152033] text-white"
            loading={isLoading}
            disabled={isLoading}
          >
            Tuma Ujumbe
          </Button>
        </Form>
      </div>


    </Card>
  );
};

export default MuhuminiStatementPage;