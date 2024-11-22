import React, {  useState } from "react";
import { Table, TableProps } from "antd";
import { ColumnsType } from "antd/lib/table";
// import "./antd.css";

interface DatatableProps<T> extends TableProps<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  isLoading?: boolean;
}


  
function onShowSizeChange(_current:any, _pageSize:any) {
    // console.log(current, pageSize);
  }

const Datatable = <T extends { id: React.Key }>({
  columns,
  dataSource,
  isLoading = false,
}: DatatableProps<T>) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Table<T>
      className="table datanew dataTable no-footer"
      rowSelection={rowSelection}
      loading={isLoading}
      columns={columns}
      dataSource={dataSource}
      pagination={{
        total: dataSource?.length,
        showTotal: (total, range) =>
          ` ${range[0]} to ${range[1]} of ${total} items`,
        showSizeChanger: true,
        onShowSizeChange: onShowSizeChange,
      }}
      rowKey={(record) => record.id}
    />
  );
};

export default Datatable;
