import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Table, Typography, DatePicker, Select, Button } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useAppSelector } from '../../store/store-hooks';
import { fetchWahumini,fetchWahuminiStatement } from '../../helpers/ApiConnectors';

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
  const [dates, setDates] = useState<[Dayjs, Dayjs]>([dayjs().subtract(1, 'month'), dayjs()]);
  const [statementData, setStatementData] = useState<MuhuminiStatement | null>(null);

  // Fetch list of Wahumini
  const { data: wahumini, isLoading: loadingWahumini } = useQuery({
    queryKey: ['wahumini'],
    queryFn: async () => {
         const response: any = await fetchWahumini(`?church_id=${church?.id}`);
         return response;
    },
  });

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

  return (
    <Card className="mt-14">
      <Title level={4}>RIPOTI YA MUHUMINI</Title>

      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <Select
            placeholder="Chagua Muhumini"
            className="w-full"
            loading={loadingWahumini}
            onChange={(value) => setSelectedMuhumini(value)}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
                (option?.children?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
              }
          >
            {wahumini?.map((m: any) => (
              <Option key={m.id} value={m.id}>
                {m.first_name} {m.last_name} - {m.jumuiya_name}
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
    </Card>
  );
};

export default MuhuminiStatementPage;