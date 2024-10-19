import { Modal, Button } from "antd";
import React, { useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons"; // Import Ant Design icons

const NoActivePackageModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to show the modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to handle when the modal is closed
  const handleCancel = () => {
    localStorage.clear();
    window.location.reload();
    setIsModalVisible(false);
  };

  // Function to redirect user to contact page (or open email)
  const handleContact = (method: string) => {
    if (method === "email") {
      window.location.href = "mailto:support@example.com?subject=No Active Package&body=I don't have an active package.";
    } else if (method === "phone") {
      window.location.href = "tel:+1234567890"; // Replace with your phone number
    } else if (method === "contactPage") {
      window.location.href = "/contact"; // Replace with your contact page link
    }
  };

  return (
    <div>
      {/* <Button type="primary" onClick={showModal}>
        Check Active Packages
      </Button> */}

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>No Active Package</span>
          </div>
        }
        open={true}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
          <Button key="email" type="primary" onClick={() => handleContact("email")}>
            Email Us
          </Button>,
          <Button key="phone" type="default" onClick={() => handleContact("phone")}>
            Call Us
          </Button>,
        ]}
      >
        <div style={{ textAlign: "center" }}>
          <p>
            <ExclamationCircleOutlined style={{ fontSize: "40px", color: "#faad14" }} />
          </p>
          <p>
            It seems like you don’t have an active package at the moment. Please contact our support team for assistance in
            activating or renewing your package.
          </p>
          <p>You can reach us via the following options:</p>
          <div>
            <Button type="link" onClick={() => handleContact("email")}>
              <strong>Email:</strong> support@example.com
            </Button>
          </div>
          <div>
            <Button type="link" onClick={() => handleContact("phone")}>
              <strong>Phone:</strong> +123-456-7890
            </Button>
          </div>
          <div>
            <Button type="link" onClick={() => handleContact("contactPage")}>
              <strong>Contact Form:</strong> Visit our contact page
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NoActivePackageModal;
