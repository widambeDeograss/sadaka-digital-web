import React from 'react';
import { Modal, Row, Col } from 'antd';

interface ViewModalProps {
  visible: boolean;
  onClose: () => void;
  data: any; 
}

const ViewModal: React.FC<ViewModalProps> = ({ visible, onClose, data }) => {
  console.log(data);
  
  return (
    <Modal
      title="View Full Ahadi Details"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={900} 
      bodyStyle={{padding: '20px', overflowY: 'auto' }} // Increased height and made scrollable
    >
      {/* Add stripes with Tailwind CSS */}
      <div className="space-y-4">
      {/* Name and Church Information */}
      <div className="p-4 bg-white odd:bg-gray-100 rounded-lg">
        <Row gutter={16}>
        <Col span={12}>
          <h4 className="font-semibold text-sm text-gray-600">Expense Category Name</h4>
          <p className="text-gray-900">
          {data?.category_name}
          </p>
        </Col>
        <Col span={12}>
          <h4 className="font-semibold text-sm text-gray-600">Expense Category Budget</h4>
          <p className="text-gray-900">
          {data?.budget}
          </p>
        </Col>
        </Row>
      </div>

      {/* Inserted By and Inserted At */}
      <div className="p-4 bg-white odd:bg-gray-100 rounded-lg">
        <Row gutter={16}>
        <Col span={12}>
          <h4 className="font-semibold text-sm text-gray-600">Inserted By</h4>
          <p className="text-gray-900">{data?.inserted_by}</p>
        </Col>
        <Col span={12}>
          <h4 className="font-semibold text-sm text-gray-600">Inserted At</h4>
          <p className="text-gray-900">{new Date(data?.inserted_at).toLocaleString()}</p>
        </Col>
        </Row>
      </div>

      {/* Updated By and Updated At */}
      <div className="p-4 bg-white odd:bg-gray-100 rounded-lg">
        <Row gutter={16}>
        <Col span={12}>
          <h4 className="font-semibold text-sm text-gray-600">Updated By</h4>
          <p className="text-gray-900">{data?.updated_by}</p>
        </Col>
        <Col span={12}>
          <h4 className="font-semibold text-sm text-gray-600">Updated At</h4>
          <p className="text-gray-900">{new Date(data?.updated_at).toLocaleString()}</p>
        </Col>
        </Row>
      </div>

   
      </div>
    </Modal>
  );
};

export default ViewModal;
