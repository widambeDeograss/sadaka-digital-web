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
      width={900} // Increased width
      bodyStyle={{ height: '600px', padding: '20px', overflowY: 'auto' }} // Increased height and made scrollable
    >
      {/* Add stripes with Tailwind CSS */}
      <div className="space-y-4">
        {/* Name and Church Information */}
        <div className="p-4 bg-white odd:bg-gray-100 rounded-lg">
          <Row gutter={16}>
            <Col span={12}>
              <h4 className="font-semibold text-sm text-gray-600">Expence category name</h4>
              <p className="text-gray-900">
                {data?.category_details?.name}
              </p>
            </Col>
            <Col span={12}>
              <h4 className="font-semibold text-sm text-gray-600">Expence category budget</h4>
              <p className="text-gray-900">
              {data?.category_details?.budget}
              </p>
            </Col>
          </Row>
        </div>

        {/* Contact Information */}
        <div className="p-4 bg-white odd:bg-gray-100 rounded-lg">
          <Row gutter={16}>
            <Col span={12}>
              <h4 className="font-semibold text-sm text-gray-600">Amount used</h4>
              <p className="text-gray-900">{data?.amount}</p>
            </Col>
            <Col span={12}>
              <h4 className="font-semibold text-sm text-gray-600">Email</h4>
              <p className="text-gray-900">{data?.bahasha_details?.mhumini_details?.email}</p>
            </Col>
          </Row>
        </div>


        {/* Collected By and Payment Type */}
        <div className="p-4 bg-white odd:bg-gray-100 rounded-lg">
          <Row gutter={16}>
            <Col span={12}>
              <h4 className="font-semibold text-sm text-gray-600">Collected By</h4>
              <p className="text-gray-900">{data?.spent_by || 'N/A'}</p>
            </Col>
            <Col span={12}>
              <h4 className="font-semibold text-sm text-gray-600">Payment Type</h4>
              <p className="text-gray-900">{data?.payment_type_details?.name || 'Unknown'}</p>
            </Col>
          </Row>
        </div>

        {/* Inserted By and Inserted At */}
        <div className="p-4 bg-white odd:bg-gray-100 rounded-lg">
          <Row gutter={16}>
            <Col span={12}>
              <h4 className="font-semibold text-sm text-gray-600">Inserted By</h4>
              <p className="text-gray-900">{data?.inserted_by || 'Unknown'}</p>
            </Col>
            <Col span={12}>
              <h4 className="font-semibold text-sm text-gray-600">Updated By</h4>
              <p className="text-gray-900">{data?.updated_by || 'Unknown'}</p>
            </Col>
          </Row>
        </div>


      </div>
    </Modal>
  );
};

export default ViewModal;
