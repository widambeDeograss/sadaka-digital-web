import React from 'react';
import { Modal, Row, Col } from 'antd';

interface ViewModalProps {
  visible: boolean;
  onClose: () => void;
  data: any; 
}

const ViewModal: React.FC<ViewModalProps> = ({ visible, onClose, data }) => {
  
  return (
    <Modal
      title="View Full Sadaka Details"
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
              <h4 className="font-semibold text-sm text-gray-600">Name</h4>
              <p className="text-gray-900">
                {data?.bahasha_details?.mhumini_details?.first_name}{" "}
                {data?.bahasha_details?.mhumini_details?.last_name}
              </p>
            </Col>
            <Col span={12}>
              <h4 className="font-semibold text-sm text-gray-600">Church</h4>
              <p className="text-gray-900">
                {data?.bahasha_details?.mhumini_details?.jumuiya_details?.church_details?.church_name}
              </p>
            </Col>
          </Row>
        </div>

        {/* Contact Information */}
        <div className="p-4 bg-white odd:bg-gray-100 rounded-lg">
          <Row gutter={16}>
            <Col span={12}>
              <h4 className="font-semibold text-sm text-gray-600">Phone Number</h4>
              <p className="text-gray-900">{data?.bahasha_details?.mhumini_details?.phone_number}</p>
            </Col>
            <Col span={12}>
              <h4 className="font-semibold text-sm text-gray-600">Email</h4>
              <p className="text-gray-900">{data?.bahasha_details?.mhumini_details?.email}</p>
            </Col>
          </Row>
        </div>

        {/* Jumuiya and Amount Information */}
        <div className="p-4 bg-white odd:bg-gray-100 rounded-lg">
          <Row gutter={16}>
            <Col span={12}>
              <h4 className="font-semibold text-sm text-gray-600">Jumuiya</h4>
              <p className="text-gray-900">{data?.bahasha_details?.mhumini_details?.jumuiya_details?.name}</p>
            </Col>
            <Col span={12}>
              <h4 className="font-semibold text-sm text-gray-600">Amount</h4>
              <p className="text-gray-900">{data?.sadaka_amount}</p>
            </Col>
          </Row>
        </div>

        {/* Card and Date Information */}
        <div className="p-4 bg-white odd:bg-gray-100 rounded-lg">
          <Row gutter={16}>
            <Col span={12}>
              <h4 className="font-semibold text-sm text-gray-600">Card No</h4>
              <p className="text-gray-900">{data?.bahasha_details?.card_no}</p>
            </Col>
            <Col span={12}>
              <h4 className="font-semibold text-sm text-gray-600">Date Collected</h4>
              <p className="text-gray-900">{data?.date}</p>
            </Col>
          </Row>
        </div>

        {/* Collected By and Payment Type */}
        <div className="p-4 bg-white odd:bg-gray-100 rounded-lg">
          <Row gutter={16}>
            <Col span={12}>
              <h4 className="font-semibold text-sm text-gray-600">Collected By</h4>
              <p className="text-gray-900">{data?.collected_by || 'N/A'}</p>
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
