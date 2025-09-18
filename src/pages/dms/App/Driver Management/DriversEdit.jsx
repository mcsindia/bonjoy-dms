import React, { useState } from "react";
import { Form, Button, Col, Alert } from "react-bootstrap";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DriversEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const driver = location.state?.driver || {};

  const [formData, setFormData] = useState({
    fullName: driver.fullName || "",
    status: driver.status || "Active",
    age: driver.age || "",
    dob: driver.date_of_birth || "",
    city: driver.city || "",
    pinCode: driver.pinCode || "",
    permanentAddress: driver.permanentAddress || "",
    temporaryAddress: driver.temporaryAddress || "",
    State: driver.State || "",
    WorkingCity: driver.WorkingCity || "",
    profileImage: driver.profileImage || "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State to hold success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formDataToSend = new FormData(); 

  formDataToSend.append("driverId", driver.userId);
  formDataToSend.append("fullName", formData.fullName);
  formDataToSend.append("status", formData.status);
  formDataToSend.append("dob", formData.dob || "");
  formDataToSend.append("city", formData.city || "");
  formDataToSend.append("pinCode", formData.pinCode || "");
  formDataToSend.append("permanentAddress", formData.permanentAddress || "");
  formDataToSend.append("temporaryAddress", formData.temporaryAddress || "");
  formDataToSend.append("State", formData.State || "");
  formDataToSend.append("WorkingCity", formData.WorkingCity || "");
  formDataToSend.append("module_id", "driver"); // 🔹 added module_id

  if (selectedFile) {
    formDataToSend.append("userProfile", selectedFile);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/createDriverProfile`, {
      method: "POST",
      body: formDataToSend,
    });

    const result = await response.json();
    if (result.success) {
      setSuccessMessage("Driver profile created/updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      navigate("/dms/driver");
    } else {
      console.error("Failed to create driver profile:", result.message);
    }
  } catch (error) {
    console.error("Error during API call:", error);
  }
};

  return (
    <AdminLayout>
      <div className="driver-edit-container">
        <h4>Edit Driver Details</h4>
        <div className="dms-form-container">
          <Form onSubmit={handleSubmit}>
            {/* Full Name */}
            <Form.Group className="dms-form-group" as={Col} controlId="formFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Status */}
            <Form.Group className="dms-form-group" controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="formDOB">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={formData.dob || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="formCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                placeholder="Enter city name"
                value={formData.city}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="formPinCode">
              <Form.Label>Pin Code</Form.Label>
              <Form.Control
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="formPermanentAddress">
              <Form.Label>Permanent Address</Form.Label>
              <Form.Control
                type="text"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="formTemporaryAddress">
              <Form.Label>Temporary Address</Form.Label>
              <Form.Control
                type="text"
                name="temporaryAddress"
                value={formData.temporaryAddress}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="formState">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                name="State"
                value={formData.State}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="formWorkingCity">
              <Form.Label>Working City</Form.Label>
              <Form.Control
                type="text"
                name="WorkingCity"
                value={formData.WorkingCity}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Upload Profile Image */}
            <Form.Group className="dms-form-group" controlId="formProfileImage">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
              />
              {formData.profileImage && (
                <div className="mb-3">
                  <Form.Label>Current Profile Image</Form.Label>
                  <div>
                    <img
                      src={`https://bonjoy.in:5000${formData.profileImage}`}
                      alt="Profile"
                      style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  </div>
                </div>
              )}
            </Form.Group>

            {/* Save and Cancel buttons */}
            <div className="save-and-cancel-btn mt-3">
              <Button type="submit" className="me-2">Save Changes</Button>
              <Button type="button" onClick={() => navigate("/dms/driver")}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
