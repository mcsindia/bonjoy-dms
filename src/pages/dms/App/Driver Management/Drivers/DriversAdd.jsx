import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { Tabs, Tab, Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DriversAdd = () => {
    const [tabKey, setTabKey] = useState('driverInfo');
    const [driverInfo, setDriverInfo] = useState({});
    const [driverDocuments, setDriverDocuments] = useState([]);
    const [vehicleInfo, setVehicleInfo] = useState({});
    const [vehicleDocuments, setVehicleDocuments] = useState([]);
    const [bankInfo, setBankInfo] = useState({});
    const [bankDocuments, setBankDocuments] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const isFirstTab = tabKey === 'driverInfo';
    const isLastTab = tabKey === 'bankDocs';

    const navigate = useNavigate();

    const handleChange = (e, stateSetter) => {
        const { name, value, type, checked, files } = e.target;
        stateSetter(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
        }));
    };

    const handleSaveTab = async (tab) => {
        // Call respective API here
        console.log(`Saving ${tab} data`);
        alert(`${tab} saved successfully!`);
    };

    // Back button logic
    const handleBack = () => {
        if (tabKey === 'driverDocs') setTabKey('driverInfo');
        else if (tabKey === 'vehicleInfo') setTabKey('driverDocs');
        else if (tabKey === 'bankDocs') setTabKey('vehicleInfo');
    };

    // Submit all
    const handleSubmitAll = async () => {
        // Call API to submit all data
        console.log('Submitting all driver data', {
            driverInfo,
            driverDocuments,
            vehicleInfo,
            vehicleDocuments,
            bankInfo,
            bankDocuments,
        });
        alert('Driver added successfully!');
        navigate('/dms/drivers');
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


    return (
        <AdminLayout>
            <div className="dms-container">
                <h4>Add Driver Details</h4>
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
                                            <Col md={6}>
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
                                            <Col md={6}>
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
                                        </Row>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Profile Image</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="userProfile"
                                                placeholder="Upload profile image"
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
                                            <Button variant="primary" onClick={() => handleSaveTab('Driver Info')}>Save Changes</Button>
                                        </div>
                                    </Form>
                                </Tab>

                                {/* Driver Documents */}
                                <Tab eventKey="driverDocs" title="Driver Documents">
                                    <Form>
                                        {['Aadhar Front', 'Aadhar Back', 'Pan Card Front', 'Pan Card Back', 'Passport Photo'].map((label) => (
                                            <Form.Group className="mb-3" key={label}>
                                                <Form.Label>{label}</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    onChange={(e) => setDriverDocuments(prev => [
                                                        ...prev.filter(d => d.file_label !== label),
                                                        { doc_type: label, document: e.target.files[0], file_label: label }
                                                    ])}
                                                />
                                            </Form.Group>
                                        ))}
                                        <div className="d-flex justify-content-between mt-3">
                                            <Button variant="secondary" onClick={handleBack}>Back</Button>
                                            <Button variant="primary" onClick={() => handleSaveTab('Driver Documents')}>Save Changes</Button>
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
                                                    <Form.Control
                                                        type="text"
                                                        name="type"
                                                        placeholder="Enter vehicle type"
                                                        value={vehicleInfo.type || ''}
                                                        onChange={(e) => handleChange(e, setVehicleInfo)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Category</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="category"
                                                        placeholder="Enter vehicle category"
                                                        value={vehicleInfo.category || ''}
                                                        onChange={(e) => handleChange(e, setVehicleInfo)}
                                                    />
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
                                                    <Form.Control
                                                        type="text"
                                                        name="fuelType"
                                                        placeholder="Enter fuel type"
                                                        value={vehicleInfo.fuelType || ''}
                                                        onChange={(e) => handleChange(e, setVehicleInfo)}
                                                    />
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
                                                        value={vehicleInfo.registrationDate || ''}
                                                        onChange={(e) => handleChange(e, setVehicleInfo)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Owned</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="owned"
                                                        placeholder="Enter ownership status"
                                                        value={vehicleInfo.owned || ''}
                                                        onChange={(e) => handleChange(e, setVehicleInfo)}
                                                    />
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

                                        <Form.Group className="mb-3">
                                            <Form.Label>Reason</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="reason"
                                                placeholder="Enter reason if any"
                                                value={vehicleInfo.reason || ''}
                                                onChange={(e) => handleChange(e, setVehicleInfo)}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Status</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="status"
                                                placeholder="Enter status"
                                                value={vehicleInfo.status || ''}
                                                onChange={(e) => handleChange(e, setVehicleInfo)}
                                            />
                                        </Form.Group>

                                        {/* Vehicle Documents with expiry date */}
                                        {['RC', 'Insurance', 'Permit'].map((label) => (
                                            <Row key={label}>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>{label} Document</Form.Label>
                                                        <Form.Control
                                                            type="file"
                                                            onChange={(e) => setVehicleDocuments(prev => [
                                                                ...prev.filter(d => d.file_label !== label),
                                                                { doc_type: label, document: e.target.files[0], file_label: label, expiry_date: prev.find(d => d.file_label === label)?.expiry_date || '' }
                                                            ])}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>{label} Expiry Date</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            value={vehicleDocuments.find(d => d.file_label === label)?.expiry_date || ''}
                                                            onChange={(e) => setVehicleDocuments(prev => prev.map(d => d.file_label === label ? { ...d, expiry_date: e.target.value } : d))}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        ))}

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
