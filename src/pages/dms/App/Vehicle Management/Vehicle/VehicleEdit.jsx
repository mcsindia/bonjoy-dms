import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const VehicleEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [formData, setFormData] = useState({
    Vehicle_ID: "",
    Type: "",
    Category: "",
    Brand: "",
    Model: "",
    Fuel_Type: "",
    Registration_Number: "",
    Registration_Date: "",
    Driver_ID: "",
    Status: "",
  });

  // Pre-fill the form with the selected vehicle's data
  useEffect(() => {

    if (state?.vehicle) {
      setFormData({
        Vehicle_ID: state.vehicle.id || "",
        Type: state.vehicle.type || "",
        Category: state.vehicle.category || "",
        Brand: state.vehicle.brandId || "",
        Model: state.vehicle.modelId || "",
        Fuel_Type: state.vehicle.fuelType || "",
        Registration_Number: state.vehicle.registrationNumber || "",
        Registration_Date: state.vehicle.registrationDate ? state.vehicle.registrationDate.split('T')[0] : "",
        Driver_ID: state.vehicle.driverId?.id || "",
        Status: state.vehicle.status || "Inactive",
      });
    }
  }, [state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedVehicle = {
      type: formData.Type,
      category: formData.Category,
      brandId: parseInt(formData.Brand, 10),  
      modelId: parseInt(formData.Model, 10),  
      fuelType: formData.Fuel_Type,
      registrationNumber: formData.Registration_Number,
      registrationDate: formData.Registration_Date,
      driverId: parseInt(formData.Driver_ID, 10),  
      status: "Inactive"
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/updateVehicle/${formData.Vehicle_ID}`,
        updatedVehicle
      );

      if (response.data.success) {
        navigate("/dms/vehicle/master");
      } else {
        console.error("Failed to update vehicle:", response.data.message);
      }
    } catch (err) {
      console.error("Error updating vehicle:", err.response?.data || err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Edit Vehicle</h4>
        <div className="dms-form-container">
          <Form onSubmit={handleSubmit}>
            {/* Vehicle ID (Read-only) */}
            <Form.Group className="dms-form-group" controlId="vehicleId">
              <Form.Label>Vehicle ID</Form.Label>
              <Form.Control
                type="text"
                name="Vehicle_ID"
                value={formData.Vehicle_ID}
                readOnly
              />
            </Form.Group>

            {/* Type */}
            <Form.Group className="dms-form-group" controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                name="Type"
                value={formData.Type}
                onChange={handleChange}
                required
              >
                <option value="">Select a type</option>
                <option value="commercial">Commercial</option>
                <option value="private">Private</option>
              </Form.Control>
            </Form.Group>

            {/* Category */}
            <Form.Group className="dms-form-group" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="Category"
                value={formData.Category}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Brand */}
            <Form.Group className="dms-form-group" controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                name="Brand"
                value={formData.Brand}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Model */}
            <Form.Group className="dms-form-group" controlId="model">
              <Form.Label>Model</Form.Label>
              <Form.Control
                type="text"
                name="Model"
                value={formData.Model}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Fuel Type */}
            <Form.Group className="dms-form-group" controlId="fuelType">
              <Form.Label>Fuel Type</Form.Label>
              <Form.Control
                as="select"
                name="Fuel_Type"
                value={formData.Fuel_Type}
                onChange={handleChange}
                required
              >
                <option value="">Select fuel type</option>
                <option value="petrol">Two-Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="EV">EV</option>
              </Form.Control>
            </Form.Group>

            {/* Registration Number */}
            <Form.Group className="dms-form-group" controlId="registrationNumber">
              <Form.Label>Registration Number</Form.Label>
              <Form.Control
                type="text"
                name="Registration_Number"
                value={formData.Registration_Number}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Registration Date */}
            <Form.Group className="dms-form-group" controlId="registrationDate">
              <Form.Label>Registration Date</Form.Label>
              <Form.Control
                type="date"
                name="Registration_Date"
                value={formData.Registration_Date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Driver ID */}
            <Form.Group className="dms-form-group" controlId="driverId">
              <Form.Label>Driver ID</Form.Label>
              <Form.Control
                type="text"
                name="Driver_ID"
                value={formData.Driver_ID}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="Status"
                value={formData.Status}
                onChange={handleChange}
                required
              >
                <option value="">Select status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Control>
            </Form.Group>


            <div className="save-and-cancel-btn">
              {/* Submit and Cancel Buttons */}
              <Button type="submit">
                Save Changes
              </Button>
              <Button type="cancel" className="ms-2" onClick={() => navigate("/dms/vehicle/master")}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};
