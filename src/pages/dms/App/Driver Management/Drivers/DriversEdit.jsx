import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { Tabs, Tab, Form, Row, Col, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { getToken } from '../../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const DriversEdit = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const driverId = state?.driver?.userId;
  const [tabKey, setTabKey] = useState('driverInfo');
  const [driverInfo, setDriverInfo] = useState({
    fullName: '',
    dob: '',
    mobile: '',
    email: '',
    state: '',
    city: '',
    pincode: '',
    permanentAddress: '',
    temporaryAddress: '',
    workingCity: '',
    aadharNumber: '',
    panNumber: '',
    licenseNumber: '',
    is_emergency_driver: false,
    userProfile: null
  });
  const [vehicleInfo, setVehicleInfo] = useState({});
  const [bankInfo, setBankInfo] = useState({});
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [allModels, setAllModels] = useState([]);

  const token = getToken();
  const isFirstTab = tabKey === 'driverInfo';

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e, setter) => {
    const { name, value, type, checked, files } = e.target;
    setter(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  // Fetch driver data
  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/getDriverAllDocument/${driverId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = res.data?.data;
        const driver = data?.DriverProfile?.[0];
        const bank = data?.BankDetail?.[0];
        const vehicle = data?.VehicleDetail?.[0];

        if (driver) {
          setDriverInfo({
            fullName: driver.fullName || '',
            dob: formatDate(driver.date_of_birth) || '',
            gender: driver.gender || '',
            mobile: driver.mobile || '',
            email: driver.email || '',
            state: driver.State || '',
            city: driver.city || '',
            pincode: driver.pinCode || '',
            permanentAddress: driver.permanentAddress || '',
            temporaryAddress: driver.temporaryAddress || '',
            workingCity: driver.WorkingCity || '',
            aadharNumber: driver.aadharNumber || '',
            panNumber: driver.panNumber || '',
            licenseNumber: driver.licenseNumber || '',
            is_emergency_driver: driver.is_emergency_driver === 1,
            userProfile: driver.profileImage ? `${API_BASE_URL}${driver.profileImage}` : null
          });
        }

        if (vehicle) {
          setVehicleInfo({
            id: vehicle.id,
            type: vehicle.type || '',
            category: vehicle.category || '',
            brandId: vehicle.brandId || '',
            modelId: vehicle.modelId || '',
            fuelType: vehicle.fuelType || '',
            vehicleNumber: vehicle.vehicleNumber || '',
            rcNumber: vehicle.registrationNumber || '',
            registrationDate: formatDate(vehicle.registrationDate) || '',
            owned: vehicle.owned || '',
          });
        }

        setBankInfo(bank || {});

      } catch (err) {
        console.error("❌ Error fetching driver details:", err);
      }
    };

    fetchDriverData();
  }, [driverId]);

  const handleBack = () => {
    if (tabKey === 'vehicleInfo') setTabKey('driverInfo');
    else if (tabKey === 'bankDocs') setTabKey('vehicleInfo');
  };

  const handleSubmitAll = () => {
    alert('Driver updated successfully');
    navigate('/dms/driver');
  };

  const handleSaveTab = (tab) => {
    if (tab === 'Driver Info') handleSaveDriverInfo();
    else if (tab === 'Vehicle Info') handleSaveVehicleInfo();
    else if (tab === 'Bank Document') handleSaveBankInfo();
  };

  const handleSaveDriverInfo = async () => {
    try {
      const formData = new FormData();
      formData.append("driverId", driverId);

      Object.entries(driverInfo).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'dob') formData.append(key, formatDate(value));
          else if (key === 'is_emergency_driver') formData.append(key, value ? 1 : 0);
          else formData.append(key, value);
        }
      });

      await axios.post(`${API_BASE_URL}/createDriverProfile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Driver Info updated successfully");
      setTabKey('vehicleInfo');

    } catch (err) {
      console.error("Error updating driver info:", err.response?.data || err);
      alert("Failed to update driver info");
    }
  };

  const handleSaveVehicleInfo = async () => {
    const vehicleId = vehicleInfo.id;
    try {
      const payload = {
        driverId,
        type: vehicleInfo.type,
        category: vehicleInfo.category,
        brandId: vehicleInfo.brandId,
        modelId: vehicleInfo.modelId,
        fuelType: vehicleInfo.fuelType,
        registrationNumber: vehicleInfo.rcNumber,
        registrationDate: vehicleInfo.registrationDate,
        owned: vehicleInfo.owned,
        vehicleNumber: vehicleInfo.vehicleNumber,
      };

      await axios.put(`${API_BASE_URL}/updateVehicle/${vehicleId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Vehicle info updated successfully');
      setTabKey('bankDocs');
    } catch (err) {
      console.error('Error updating vehicle info:', err);
      alert('Failed to update vehicle info');
    }
  };

  const handleSaveBankInfo = async () => {
    try {
      const bankId = bankInfo.id;
      if (!bankId) return console.error('Bank ID not found');

      const payload = {
        driverId: bankInfo.driverId,
        bankName: bankInfo.bankName,
        accountNo: bankInfo.accountNo,
        ifscCode: bankInfo.ifscCode,
        branchName: bankInfo.branchName,
      };

      const res = await axios.put(`${API_BASE_URL}/updateDriverBankDetails/${bankId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBankInfo(res.data.data);

      alert('Bank info updated successfully');
    } catch (err) {
      console.error('Error updating bank info:', err.response?.data || err);
      alert('Failed to update bank info');
    }
  };

  // Fetch brands
  useEffect(() => {
    fetch(`${API_BASE_URL}/getAllBrands`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setBrands(data.data.data);
      })
      .catch(err => console.error('Error fetching brands:', err));
  }, []);

  // Fetch models
  useEffect(() => {
    fetch(`${API_BASE_URL}/getAllModels`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setAllModels(data.data.models);
      })
      .catch(err => console.error('Error fetching models:', err));
  }, []);

  const handleBrandChange = (e) => {
    const brandId = parseInt(e.target.value);
    setVehicleInfo(prev => ({ ...prev, brandId, modelId: '' }));
    const filteredModels = allModels.filter(m => m.brandId === brandId);
    setModels(filteredModels);
  };

  useEffect(() => {
    if (allModels.length && vehicleInfo.brandId) {
      const filtered = allModels.filter(m => m.brandId === vehicleInfo.brandId);
      setModels(filtered);
    }
  }, [allModels, vehicleInfo.brandId]);

  return (
    <AdminLayout>
      <div className="dms-container">
        <h4>Edit Driver Details</h4>
        <Row >
          <Col lg={12}>
            <div className="dms-form-container">
              <Tabs activeKey={tabKey} onSelect={setTabKey} className="mb-3">

                {/* Driver Info */}
                <Tab eventKey="driverInfo" title="Driver Info">
                  <Form>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="fullName"
                            placeholder="Enter full name"
                            value={driverInfo.fullName || ''}
                            onChange={(e) => handleChange(e, setDriverInfo)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Gender</Form.Label>
                          <Form.Select
                            name="gender"
                            value={driverInfo.gender || ''}
                            onChange={(e) => handleChange(e, setDriverInfo)}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Birth</Form.Label>
                          <Form.Control
                            type="date"
                            name="dob"
                            placeholder="Select date of birth"
                            value={driverInfo.dob || ''}
                            onChange={(e) => handleChange(e, setDriverInfo)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Mobile Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="mobile"
                            placeholder="Enter mobile number"
                            value={driverInfo.mobile || ''}
                            onChange={(e) => handleChange(e, setDriverInfo)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={driverInfo.email || ''}
                            onChange={(e) => handleChange(e, setDriverInfo)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      {/* State Dropdown */}
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>State</Form.Label>
                          <Form.Select
                            name="state"
                            value={driverInfo.state || ''}
                            onChange={(e) => handleChange(e, setDriverInfo)}
                          >
                            <option value="">Select State</option>
                            <option value="Rajasthan">Rajasthan</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      {/* City Dropdown */}
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Select
                            name="city"
                            value={driverInfo.city || ''}
                            onChange={(e) => handleChange(e, setDriverInfo)}
                          >
                            <option value="">Select City</option>
                            <option value="Ajmer">Ajmer</option>
                            <option value="Kota">Kota</option>
                            <option value="Jaipur">Jaipur</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Pincode</Form.Label>
                          <Form.Control
                            type="text"
                            name="pincode"
                            placeholder="Enter pincode"
                            value={driverInfo.pincode || ''}
                            onChange={(e) => handleChange(e, setDriverInfo)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Permanent Address</Form.Label>
                          <Form.Control
                            type="text"
                            name="permanentAddress"
                            placeholder="Enter permanent address"
                            value={driverInfo.permanentAddress || ''}
                            onChange={(e) => handleChange(e, setDriverInfo)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Temporary Address</Form.Label>
                          <Form.Control
                            type="text"
                            name="temporaryAddress"
                            placeholder="Enter temporary address"
                            value={driverInfo.temporaryAddress || ''}
                            onChange={(e) => handleChange(e, setDriverInfo)}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Working City</Form.Label>
                          <Form.Select
                            name="workingCity"
                            value={driverInfo.workingCity || ''}
                            onChange={(e) => handleChange(e, setDriverInfo)}
                          >
                            <option value="">Select Working City</option>
                            <option value="Ajmer">Ajmer</option>
                            <option value="Kota">Kota</option>
                            <option value="Jaipur">Jaipur</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Profile Image</Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="file"
                          name="userProfile"
                          onChange={(e) => handleChange(e, setDriverInfo)}
                        />
                        {driverInfo.userProfile && typeof driverInfo.userProfile === 'string' && (
                          <img
                            src={`${IMAGE_BASE_URL}${driverInfo.userProfile.startsWith(API_BASE_URL) ? driverInfo.userProfile.replace(API_BASE_URL, '') : driverInfo.userProfile}`}
                            alt="Profile Preview"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "50%",
                              marginLeft: "10px"
                            }}
                          />
                        )}
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Emergency Driver"
                        name="is_emergency_driver"
                        checked={driverInfo.is_emergency_driver || false}
                        onChange={(e) => handleChange(e, setDriverInfo)}
                      />
                    </Form.Group>


                    <div className="d-flex justify-content-between mt-3">
                      {!isFirstTab && <Button variant="secondary" onClick={handleBack}>Back</Button>}
                      <Button variant="primary" onClick={() => handleSaveTab('Driver Info')}>Save Changes</Button>
                    </div>
                  </Form>
                </Tab>

                {/* Vehicle Info + Documents */}
                <Tab eventKey="vehicleInfo" title="Vehicle Info">
                  <Form>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Type</Form.Label>
                          <Form.Select
                            name="type"
                            value={vehicleInfo.type || ''}
                            onChange={(e) => handleChange(e, setVehicleInfo)}
                          >
                            <option value="">Select Type</option>
                            <option value="Private">Private</option>
                            <option value="Commercial">Commercial</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Category</Form.Label>
                          <Form.Select
                            name="category"
                            value={vehicleInfo.category || ''}
                            onChange={(e) => handleChange(e, setVehicleInfo)}
                          >
                            <option value="">Select Category</option>
                            <option value="Bike">Bike</option>
                            <option value="Car">Car</option>
                            <option value="SUV">SUV</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Brand</Form.Label>
                          <Form.Select
                            name="brandId"
                            value={vehicleInfo.brandId || ''}
                            onChange={handleBrandChange}
                          >
                            <option value="">Select Brand</option>
                            {brands.map(b => (
                              <option key={b.id} value={b.id}>{b.brandName}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Model</Form.Label>
                          <Form.Select
                            name="modelId"
                            value={vehicleInfo.modelId || ''}
                            onChange={(e) => handleChange(e, setVehicleInfo)}
                          >
                            <option value="">Select Model</option>
                            {models.map(m => (
                              <option key={m.id} value={m.id}>{m.modelName}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Fuel Type</Form.Label>
                          <Form.Select
                            name="fuelType"
                            value={vehicleInfo.fuelType || ''}
                            onChange={(e) => handleChange(e, setVehicleInfo)}
                          >
                            <option value="">Select Fuel Type</option>
                            <option value="petrol">Petrol</option>
                            <option value="diesel">Diesel</option>
                            <option value="electric">Electric</option>
                            <option value="cng">CNG</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Vehicle Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="vehicleNumber"
                            placeholder="Enter vehicle number"
                            value={vehicleInfo.vehicleNumber || ''}
                            onChange={(e) => handleChange(e, setVehicleInfo)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Registration Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="registrationDate"
                            placeholder="Select registration date"
                            value={vehicleInfo.registrationDate || ''}
                            onChange={(e) => handleChange(e, setVehicleInfo)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Owned</Form.Label>
                          <Form.Select
                            name="owned"
                            value={vehicleInfo.owned || ''}
                            onChange={(e) => handleChange(e, setVehicleInfo)}
                          >
                            <option value="">Select Ownership</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>RC Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="rcNumber"
                            placeholder="Enter RC number"
                            value={vehicleInfo.rcNumber || ''}
                            onChange={(e) => handleChange(e, setVehicleInfo)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-between mt-3">
                      <Button variant="secondary" onClick={handleBack}>Back</Button>
                      <Button variant="primary" onClick={() => handleSaveTab('Vehicle Info')}>Save Changes</Button>
                    </div>
                  </Form>
                </Tab>

                {/* Bank Details + Document */}
                <Tab eventKey="bankDocs" title="Bank Document">
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Bank Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="bankName"
                            placeholder="Enter bank name"
                            value={bankInfo.bankName || ''}
                            onChange={(e) => handleChange(e, setBankInfo)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Account Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="accountNo"
                            placeholder="Enter account number"
                            value={bankInfo.accountNo || ''}
                            onChange={(e) => handleChange(e, setBankInfo)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>IFSC Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="ifscCode"
                            placeholder="Enter IFSC code"
                            value={bankInfo.ifscCode || ''}
                            onChange={(e) => {
                              const value = e.target.value.toUpperCase(); 
                              const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/; 
                              if (value === '' || regex.test(value)) {
                                handleChange({ target: { name: 'ifscCode', value } }, setBankInfo);
                              } else {
                                handleChange({ target: { name: 'ifscCode', value } }, setBankInfo);
                              }
                            }}
                            maxLength={11}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Branch Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="branchName"
                            placeholder="Enter branch name"
                            value={bankInfo.branchName || ''}
                            onChange={(e) => handleChange(e, setBankInfo)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-between mt-3">
                      <div>
                        <Button variant="secondary" onClick={handleBack} className="me-2">Back</Button>
                        <Button variant="primary" onClick={() => handleSaveTab('Bank Document')}>Save Changes</Button>
                      </div>
                      <Button variant="success" onClick={handleSubmitAll}>Submit All</Button>
                    </div>
                  </Form>
                </Tab>
              </Tabs>
            </div>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};
