import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { Tabs, Tab, Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DriversAdd = () => {
    const [tabKey, setTabKey] = useState('driverInfo');
    const [driverDocuments, setDriverDocuments] = useState([]);
    const [vehicleDocuments, setVehicleDocuments] = useState([]);
    const [bankInfo, setBankInfo] = useState({});
    const [bankDocuments, setBankDocuments] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [driverId, setDriverId] = useState(null);
    const [driverSystemId, setDriverSystemId] = useState(null);
    const isFirstTab = tabKey === 'driverInfo';
    const isLastTab = tabKey === 'bankDocs';
    const [driverInfo, setDriverInfo] = useState({
        aadharNumber: '',
        panNumber: '',
        licenseNumber: '',
    });
    const [vehicleInfo, setVehicleInfo] = useState({
        type: '',
        category: '',
        brandId: '',
        modelId: '',
        fuelType: '',
        registrationNumber: '',
        rcNumber: '',
        registrationDate: '',
        owned: '',
    });
    const [vehicleImages, setVehicleImages] = useState({
        left: null,
        right: null,
        front: null,
        back: null,
        meter: null
    });

    const navigate = useNavigate();

    const handleChange = (e, stateSetter) => {
        const { name, value, type, checked, files } = e.target;
        stateSetter(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
        }));
    };

    const handleSaveTab = async (tab) => {
        try {
            const token = getToken();

            if (tab === 'Driver Info') {
                const formData = new FormData();
                formData.append('fullName', driverInfo.fullName || '');
                formData.append('city', driverInfo.city || '');
                formData.append('pinCode', driverInfo.pincode || '');
                formData.append('permanentAddress', driverInfo.permanentAddress || '');
                formData.append('temporaryAddress', driverInfo.temporaryAddress || '');
                formData.append('state', driverInfo.state || '');
                formData.append('workingCity', driverInfo.workingCity || '');
                formData.append('is_emergency_driver', driverInfo.is_emergency_driver ? 1 : 0);
                formData.append('mobile', driverInfo.mobile || '');
                formData.append('email', driverInfo.email || '');
                if (driverInfo.userProfile) formData.append('userProfile', driverInfo.userProfile);

                const response = await fetch(`${API_BASE_URL}/addDriver`, { method: 'POST', body: formData });
                const data = await response.json();

                if (data.success) {
                    const savedId = data.data?.id;
                    const driverSystemId = data.data?.driverId;
                    setDriverId(savedId);
                    setDriverSystemId(driverSystemId);
                    alert('Driver Info saved successfully!');
                    setTabKey('driverDocs');
                } else {
                    alert(data.message || 'Failed to save driver info.');
                }

            } else if (tab === 'Driver Documents') {
                if (!driverId) {
                    alert("Please save Driver Info first!");
                    return;
                }

                const uploadPromises = driverDocuments.map(async (doc) => {
                    const formData = new FormData();
                    const typeMapping = {
                        "Aadhar Front": "AADHAR_F",
                        "Aadhar Back": "AADHAR_B",
                        "Pan Card Front": "PAN_F",
                        "Pan Card Back": "PAN_B",
                    };
                    formData.append("doc_type", typeMapping[doc.doc_type] || doc.doc_type);
                    formData.append("file_label", typeMapping[doc.file_label] || doc.file_label);
                    formData.append('document', doc.document);
                    formData.append('driverId', driverSystemId);

                    const response = await fetch(`${API_BASE_URL}/addDocument`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` },
                        body: formData,
                    });

                    const result = await response.json();
                    if (!result.success) throw new Error(result.message || `Failed to upload ${doc.file_label}`);
                    return result;
                });

                await Promise.all(uploadPromises);
                alert("Driver documents uploaded successfully!");
                setTabKey('vehicleInfo');

            } else if (tab === 'Vehicle Info') {
                if (!driverId) {
                    alert("Please save Driver Info first!");
                    return;
                }

                try {
                    const vehicleResponse = await fetch(`${API_BASE_URL}/createVehicle`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            driverId: driverSystemId,
                            type: vehicleInfo.type || '',
                            category: vehicleInfo.category || '',
                            brandId: vehicleInfo.brandId || '',
                            modelId: vehicleInfo.modelId || '',
                            fuelType: vehicleInfo.fuelType || '',
                            registrationNumber: vehicleInfo.registrationNumber || '',
                            registrationDate: vehicleInfo.registrationDate || '',
                            owned: vehicleInfo.owned || '',
                            rcNumber: vehicleInfo.rcNumber || '',
                            vehicleNumber: vehicleInfo.vehicleNumber || vehicleInfo.registrationNumber || '',
                        }),
                    });

                    const vehicleData = await vehicleResponse.json();

                    if (!vehicleData.success) {
                        alert(vehicleData.message || "Failed to save vehicle info");
                        return;
                    }

                    const vehicleDocPromises = vehicleDocuments.map(async (doc) => {
                        const formData = new FormData();
                        formData.append('doc_type', doc.doc_type);
                        formData.append('file_label', doc.file_label);
                        formData.append('expiry_date', doc.expiry_date || '');
                        formData.append('document', doc.document);
                        formData.append('driver_id', driverId);

                        const docResponse = await fetch(`${API_BASE_URL}/createDriverVehicleDocument`, {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${token}` },
                            body: formData
                        });

                        const docData = await docResponse.json();
                        if (!docData.success) throw new Error(docData.message || `Failed to upload ${doc.file_label}`);
                        return docData;
                    });

                    await Promise.all(vehicleDocPromises);
                    alert('Vehicle info and documents saved successfully!');
                    setTabKey('bankDocs');

                } catch (err) {
                    console.error('Error saving vehicle info/documents:', err);
                    alert(err.message || "Error saving vehicle info/documents.");
                }
            } else if (tab === 'Bank Document') {
                if (!driverId) {
                    alert("Please save Driver Info first!");
                    return;
                }

                try {
                    const bankResponse = await fetch(`${API_BASE_URL}/createDriverBankDetails`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            driverId: driverSystemId,
                            bankName: bankInfo.bankName || '',
                            accountNo: bankInfo.accountNo || '',
                            ifscCode: bankInfo.ifscCode || '',
                            branchName: bankInfo.branchName || '',
                            docType: 'passbook',
                            verificationStatus: 'Pending',
                            version: '1',
                            uploadedAt: new Date().toISOString(),
                            submittedAt: new Date().toISOString(),
                        }),
                    });

                    const bankData = await bankResponse.json();

                    if (!bankData.success) {
                        alert(bankData.message || "Failed to save bank info");
                        return;
                    }

                    // 2️⃣ Save Bank Document (file)
                    if (bankDocuments.length > 0 && bankDocuments[0].document) {
                        const formData = new FormData();
                        formData.append('document', bankDocuments[0].document);
                        formData.append('file_label', bankDocuments[0].file_label || 'Passbook');
                        formData.append('driver_id', driverId);

                        const docResponse = await fetch(`${API_BASE_URL}/createDriverBankDocument`, {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${getToken()}` },
                            body: formData
                        });

                        const docData = await docResponse.json();
                        if (!docData.success) throw new Error(docData.message || "Failed to upload bank document");
                    }

                    alert('Bank info and document saved successfully!');
                    setTabKey('bankDocs');

                } catch (err) {
                    console.error('Error saving bank info/documents:', err);
                    alert(err.message || "Error saving bank info/documents.");
                }
            }
        } catch (err) {
            console.error('Error saving driver info:', err);
            alert('Error saving driver info.');
        }
    };

    // Back button logic
    const handleBack = () => {
        if (tabKey === 'driverDocs') setTabKey('driverInfo');
        else if (tabKey === 'vehicleInfo') setTabKey('driverDocs');
        else if (tabKey === 'bankDocs') setTabKey('vehicleInfo');
    };

    // Submit all
    const handleSubmitAll = async () => {
        alert('Driver added successfully!');
        navigate('/dms/driver');
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
                                                    <Form.Label>Registration / Vehicle Number</Form.Label>
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
                                                            value={vehicleDocuments.find(d => d.file_label === label)?.expiry_date || ''}
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
