import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { Tabs, Tab, Form, Row, Col, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import axios from "axios";
import { getToken, } from '../../../../../utils/authhelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const DriversEdit = () => {
  const { state } = useLocation();
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
  const [driverDocuments, setDriverDocuments] = useState([]);
  const [vehicleInfo, setVehicleInfo] = useState({});
  const [vehicleDocuments, setVehicleDocuments] = useState([]);
  const [vehicleImages, setVehicleImages] = useState({
    left: null,
    right: null,
    front: null,
    back: null,
    meter: null
  });
  const [bankInfo, setBankInfo] = useState({});
  const [bankDocuments, setBankDocuments] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const token = getToken();
  const isFirstTab = tabKey === 'driverInfo';
  const isLastTab = tabKey === 'bankDocs';

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
            is_emergency_driver: driver.is_emergency_driver || false,
            userProfile: driver.profileImage || null
          });
        }

        setBankInfo(bank || {});
        setVehicleInfo(vehicle || {});
        setDriverDocuments(data?.Document || []);
        setVehicleDocuments(data?.VehicleDocument || []);
        setBankDocuments(data?.BankDocumentDetail || []);

      } catch (err) {
        console.error("❌ Error fetching driver details:", err);
      }
    };

    fetchDriverData();
  }, [driverId]);

  const handleBack = () => {
    if (tabKey === 'driverDocs') setTabKey('driverInfo');
    else if (tabKey === 'vehicleInfo') setTabKey('driverDocs');
    else if (tabKey === 'bankDocs') setTabKey('vehicleInfo');
  };

  const handleSaveDriverInfo = async () => {
    try {
      const formData = new FormData();
      formData.append("driverId", driverId);
      Object.entries(driverInfo).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'dob') {
            formData.append(key, formatDate(value));
          } else if (key === 'is_emergency_driver') {
            formData.append(key, value ? 1 : 0);
          } else {
            formData.append(key, value);
          }
        }
      });

      const res = await axios.post(`${API_BASE_URL}/createDriverProfile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Driver Info updated successfully");
      setTabKey('driverDocs');

    } catch (err) {
      console.error("Error updating driver info:", err.response?.data || err);
      alert("Failed to update driver info");
    }
  };

  const handleSaveDriverDocuments = async () => {
    try {
      for (let doc of driverDocuments) {
        if (doc.document instanceof File) {
          const formData = new FormData();
          formData.append('document', doc.document);
          formData.append('doc_type', doc.doc_type);
          formData.append('file_label', doc.file_label);

          await axios.put(`${API_BASE_URL}/updateDriverDocument/${doc.id}`, formData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      }
      alert('Driver Documents updated successfully');
       setTabKey('vehicleInfo');
    } catch (err) {
      console.error('Error updating driver documents:', err);
      alert('Failed to update driver documents');
    }
  };

  const handleSaveVehicleInfo = async () => {
    try {
      await axios.put(`${API_BASE_URL}/updateVehicle/${vehicleInfo.id}`, vehicleInfo, {
        headers: { Authorization: `Bearer ${token}` }
      });

      for (let doc of vehicleDocuments) {
        if (doc.document instanceof File) {
          const formData = new FormData();
          formData.append('document', doc.document);
          formData.append('doc_type', doc.doc_type);
          formData.append('file_label', doc.file_label);
          if (doc.expiry_date) formData.append('expiry_date', doc.expiry_date);

          await axios.put(`${API_BASE_URL}/updateDriverVehicleDocument/${doc.id}`, formData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      }
      alert('Vehicle info and documents updated successfully');
        setTabKey('bankDocs');
    } catch (err) {
      console.error('Error updating vehicle info/documents:', err);
      alert('Failed to update vehicle info/documents');
    }
  };

  const handleSaveBankInfo = async () => {
    try {
      await axios.put(`${API_BASE_URL}/updateDriverBankDetails/${bankInfo.id}`, bankInfo, {
        headers: { Authorization: `Bearer ${token}` }
      });

      for (let doc of bankDocuments) {
        if (doc.document instanceof File) {
          const formData = new FormData();
          formData.append('document', doc.document);
          formData.append('docType', doc.docType);
          formData.append('file_label', doc.file_label);

          await axios.put(`${API_BASE_URL}/updateDriverBankDocument/${doc.id}`, formData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      }
      alert('Bank info and documents updated successfully');
      setTabKey('bankDocs');
    } catch (err) {
      console.error('Error updating bank info/documents:', err);
      alert('Failed to update bank info/documents');
    }
  };

  const handleSubmitAll = () => {
    alert('Driver updated successfully (UI only)');
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/getAllBrands`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setBrands(data.data.data);
      })
      .catch(err => console.error('Error fetching brands:', err));
  }, []);

  const [allModels, setAllModels] = useState([]);

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
                      <Col md={6}>
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
                      <Col md={6}>
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
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            type="text"
                            name="state"
                            placeholder="Enter state"
                            value={driverInfo.state || ''}
                            onChange={(e) => handleChange(e, setDriverInfo)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            placeholder="Enter city"
                            value={driverInfo.city || ''}
                            onChange={(e) => handleChange(e, setDriverInfo)}
                          />
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
                          <Form.Control
                            type="text"
                            name="workingCity"
                            placeholder="Enter working city"
                            value={driverInfo.workingCity || ''}
                            onChange={(e) => handleChange(e, setDriverInfo)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Aadhar Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="aadharNumber"
                            placeholder="Enter Aadhar Number"
                            value={driverInfo.aadharNumber || ''}
                            onChange={(e) => handleChange(e, setDriverInfo)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Pan Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="panNumber"
                            placeholder="Enter Pan Number"
                            value={driverInfo.panNumber || ''}
                            onChange={(e) => handleChange(e, setDriverInfo)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>License Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="licenseNumber"
                            placeholder="Enter License Number"
                            value={driverInfo.licenseNumber || ''}
                            onChange={(e) => handleChange(e, setDriverInfo)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Profile Image</Form.Label>
                      {driverInfo.userProfile && (
                        <div className="mb-2">
                          <img
                            src={
                              driverInfo.userProfile instanceof File
                                ? URL.createObjectURL(driverInfo.userProfile)
                                : `${IMAGE_BASE_URL}${driverInfo.userProfile}`
                            }
                            alt="Driver Profile"
                            style={{
                              width: '100px',
                              height: '100px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid #ddd'
                            }}
                          />
                        </div>
                      )}
                      <Form.Control
                        type="file"
                        name="userProfile"
                        onChange={(e) => handleChange(e, setDriverInfo)}
                      />
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
                      <Button variant="primary" onClick={handleSaveDriverInfo}>Save Changes</Button>
                    </div>
                  </Form>
                </Tab>

                {/* Driver Documents */}
                <Tab eventKey="driverDocs" title="Driver Documents">
                  <Form>
                    {['Aadhar', 'Pan Card', 'License'].map((doc) => (
                      <div key={doc}>
                        {['Front', 'Back'].map((side) => (
                          <Form.Group className="mb-3" key={`${doc} ${side}`}>
                            <Form.Label>{`${doc} ${side}`}</Form.Label>
                            <Form.Control
                              type="file"
                              onChange={(e) =>
                                setDriverDocuments(prev => [
                                  ...prev.filter(d => d.file_label !== `${doc} ${side}`),
                                  { doc_type: doc, document: e.target.files[0], file_label: `${doc} ${side}` }
                                ])
                              }
                            />
                          </Form.Group>
                        ))}
                      </div>
                    ))}

                    <div className="d-flex justify-content-between mt-3">
                      <Button variant="secondary" onClick={handleBack}>Back</Button>
                      <Button variant="primary" onClick={handleSaveDriverDocuments}>Save Changes</Button>
                    </div>
                  </Form>
                </Tab>

                {/* Vehicle Info + Documents */}
                <Tab eventKey="vehicleInfo" title="Vehicle Info + Documents">
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
                          <Form.Label>Registration Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="registrationNumber"
                            placeholder="Enter registration number"
                            value={vehicleInfo.registrationNumber || ''}
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
                            value={formatDate(vehicleInfo.registrationDate) || ''}
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
                    {/* Vehicle Documents with expiry date */}
                    {['RC', 'Insurance', 'Permit', 'PUC'].map((label) => (
                      <Row key={label}>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>{label} Document</Form.Label>
                            <Form.Control
                              type="file"
                              onChange={(e) => setVehicleDocuments(prev => [
                                ...prev.filter(d => d.file_label !== label),
                                {
                                  doc_type: label,
                                  document: e.target.files[0],
                                  file_label: label,
                                  expiry_date: prev.find(d => d.file_label === label)?.expiry_date || ''
                                }
                              ])}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>{label} Expiry Date</Form.Label>
                            <Form.Control
                              type="date"
                              value={formatDate(vehicleDocuments.find(d => d.file_label === label)?.expiry_date) || ''}
                              onChange={(e) =>
                                setVehicleDocuments(prev => prev.map(d =>
                                  d.file_label === label ? { ...d, expiry_date: e.target.value } : d
                                ))
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    ))}

                    <h5>Vehicle Images</h5>
                    <Row>
                      {['left', 'right', 'front', 'back', 'meter'].map((pos) => (
                        <Col md={4} key={pos}>
                          <Form.Group className="mb-3">
                            <Form.Label>{`Vehicle ${pos.charAt(0).toUpperCase() + pos.slice(1)}`}</Form.Label>
                            <Form.Control
                              type="file"
                              onChange={(e) =>
                                setVehicleImages(prev => ({ ...prev, [pos]: e.target.files[0] }))
                              }
                            />
                          </Form.Group>
                        </Col>
                      ))}
                    </Row>

                    <div className="d-flex justify-content-between mt-3">
                      <Button variant="secondary" onClick={handleBack}>Back</Button>
                      <Button variant="primary" onClick={handleSaveVehicleInfo}>Save Changes</Button>
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
                            onChange={(e) => handleChange(e, setBankInfo)}
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

                    <Form.Group className="mb-3">
                      <Form.Label>Passbook / Cheque Image</Form.Label>
                      <Form.Control
                        type="file"
                        placeholder="Upload passbook or cheque image"
                        onChange={(e) => setBankDocuments([{ docType: 'passbook', document: e.target.files[0], file_label: 'Passbook' }])}
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-between mt-3">
                      <div>
                        <Button variant="secondary" onClick={handleBack} className="me-2">Back</Button>
                        <Button variant="primary" onClick={handleSaveBankInfo}>Save Changes</Button>
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
