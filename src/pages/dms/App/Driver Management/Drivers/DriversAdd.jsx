import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';
import { Tabs, Tab, Form, Row, Col, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getToken } from "../../../../../utils/authhelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

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
    const [existingDocuments, setExistingDocuments] = useState([]);
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
                formData.append('State', driverInfo.state || '');
                formData.append('WorkingCity', driverInfo.workingCity || '');
                formData.append('gender', driverInfo.gender || '');
                formData.append('dob', driverInfo.dob && driverInfo.dob !== 'Invalid date' ? driverInfo.dob : '');
                formData.append('is_emergency_driver', driverInfo.is_emergency_driver ? 1 : 0);
                formData.append('mobile', driverInfo.mobile || '');
                formData.append('email', driverInfo.email || '');
                formData.append('is_signup', 1); // ✅ new field added
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

                fetchDriverDocuments(driverSystemId);
            } else if (tab === 'Driver Documents') {
                if (!driverSystemId) {
                    alert("Please save Driver Info first!");
                    return;
                }

                try {
                    const token = getToken();

                    for (const doc of driverDocuments) {
                        const formData = new FormData();
                        formData.append("doc_type", doc.doc_type || 'GENERAL');
                        formData.append("file_label", doc.file_label || '');
                        formData.append("document_number", doc.document_number || '');
                        formData.append("document", doc.document);
                        formData.append("driverId", driverSystemId);

                        const response = await fetch(`${API_BASE_URL}/addDocument`, {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${token}` },
                            body: formData,
                        });

                        const result = await response.json();
                        if (!result.success) throw new Error(result.message || `Failed to upload ${doc.file_label}`);

                        await fetchDriverDocuments(driverSystemId);
                    }
                    setDriverDocuments([{ resetKey: Date.now() }]);

                    alert("Driver documents uploaded successfully!");
                } catch (err) {
                    console.error(err);
                    alert('Error uploading driver documents.');
                }
            }
            else if (tab === 'Vehicle Info') {
                if (!driverSystemId) {
                    alert("Please save Driver Info first!");
                    return;
                }

                const vehiclePayload = {
                    driverId: driverSystemId,
                    type: vehicleInfo.type || '',
                    category: vehicleInfo.category || '',
                    brandId: vehicleInfo.brandId || '',
                    modelId: vehicleInfo.modelId || '',
                    fuelType: vehicleInfo.fuelType || '',
                    registrationNumber: vehicleInfo.rcNumber || '',
                    registrationDate:
                        vehicleInfo.registrationDate &&
                            vehicleInfo.registrationDate !== 'Invalid date'
                            ? vehicleInfo.registrationDate
                            : null,
                    owned: vehicleInfo.owned || '',
                    vehicleNumber: vehicleInfo.vehicleNumber || '',
                };

                const vehicleResponse = await fetch(`${API_BASE_URL}/createVehicle`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(vehiclePayload),
                });

                const vehicleData = await vehicleResponse.json();

                if (!vehicleData.success) {
                    alert(vehicleData.message || "Failed to save vehicle info");
                    return;
                }

                const allVehicleDocs = [...vehicleDocuments];

                const vehicleDocPromises = allVehicleDocs.map(async (doc) => {
                    const formData = new FormData();
                    formData.append('doc_type', doc.doc_type);
                    formData.append('file_label', doc.file_label);
                    formData.append('document', doc.document);
                    formData.append('driverId', driverSystemId);

                    if (doc.expiry_date && doc.expiry_date !== 'Invalid date') {
                        formData.append('expiry_date', doc.expiry_date);
                    }

                    if (doc.document_number && doc.document_number.length <= 10) {
                        formData.append('document_number', doc.document_number);
                    }

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

                // 4️⃣ BANK INFO + BANK DOCS
            } else if (tab === 'Bank Document') {
                const bankPayload = {
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
                };

                const bankResponse = await fetch(`${API_BASE_URL}/createDriverBankDetails`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bankPayload),
                });

                const bankData = await bankResponse.json();

                if (!bankData.success) {
                    alert(bankData.message || "Failed to save bank info");
                    return;
                }

                if (bankDocuments.length > 0 && bankDocuments[0].document) {
                    const formData = new FormData();
                    formData.append('document', bankDocuments[0].document);
                    formData.append('file_label', bankDocuments[0].file_label || 'Passbook');
                    formData.append('driverId', driverSystemId);

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
            }

        } catch (err) {
            console.error('❌ Error saving driver info:', err);
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

    const fetchDriverDocuments = async (id) => {
        try {
            const token = getToken();
            const res = await fetch(`${API_BASE_URL}/getAllDriverDocuments?driverId=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setExistingDocuments(data.data.data);
            }
        } catch (err) {
            console.error('Error fetching driver documents:', err);
        }
    };

    useEffect(() => {
        if (!driverSystemId) return;

        const fetchDocuments = async () => {
            try {
                const token = getToken();
                const res = await fetch(`${API_BASE_URL}/getAllDriverDocuments?driverId=${driverSystemId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (data.success) {
                    setExistingDocuments(data.data.data);
                }
            } catch (err) {
                console.error('Error fetching driver documents:', err);
            }
        };

        fetchDocuments();
    }, [driverSystemId]);

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
                                                    <Form.Select
                                                        name="state"
                                                        value={driverInfo.state || 'Rajasthan'}
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
                                                        <option value="Jaipur">Jaipur</option>
                                                        <option value="Ajmer">Ajmer</option>
                                                        <option value="Kota">Kota</option>
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
                                                        <option value="Jaipur">Jaipur</option>
                                                        <option value="Ajmer">Ajmer</option>
                                                        <option value="Kota">Kota</option>
                                                    </Form.Select>
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
                                        <h5 className='mb-4'>Upload All Required Driver Documents (Front & Back)</h5>
                                        <Row className="mb-3 align-items-end">
                                            <Col md={4}>
                                                <Form.Group>
                                                    <Form.Label>Document Type</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder='Enter document type (eg. AADHAR, PAN)'
                                                        value={driverDocuments[0]?.doc_type || ''}
                                                        onChange={(e) =>
                                                            setDriverDocuments(prev => {
                                                                const copy = [...prev];
                                                                copy[0] = {
                                                                    ...copy[0],
                                                                    doc_type: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1),
                                                                    file_label: copy[0]?.file_label
                                                                };
                                                                return copy;
                                                            })
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={4}>
                                                <Form.Group>
                                                    <Form.Label>File Label</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder='Enter document name (eg. Front/Back)'
                                                        value={driverDocuments[0]?.file_label || ''}
                                                        onChange={(e) =>
                                                            setDriverDocuments(prev => {
                                                                const copy = [...prev];
                                                                copy[0] = {
                                                                    ...copy[0],
                                                                    file_label: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
                                                                };
                                                                return copy;
                                                            })
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={4}>
                                                <Form.Group>
                                                    <Form.Label>Document Number</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder='Enter document number'
                                                        value={driverDocuments[0]?.document_number || ''}
                                                        onChange={(e) =>
                                                            setDriverDocuments(prev => {
                                                                const copy = [...prev];
                                                                copy[0] = { ...copy[0], document_number: e.target.value };
                                                                return copy;
                                                            })
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={4}>
                                                <Form.Group className='mt-2'>
                                                    <Form.Label>Upload Document</Form.Label>
                                                    <Form.Control
                                                        key={driverDocuments[0]?.resetKey} // change this to force re-render
                                                        type="file"
                                                        onChange={(e) =>
                                                            setDriverDocuments(prev => {
                                                                const copy = [...prev];
                                                                copy[0] = { ...copy[0], document: e.target.files[0] };
                                                                return copy;
                                                            })
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <div className="mt-4">
                                            <h5>Already Submitted Documents</h5>
                                            {existingDocuments.length === 0 ? (
                                                <p>No documents uploaded yet.</p>
                                            ) : (
                                                <Table striped bordered hover size="sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Document Type</th>
                                                            <th>File Label</th>
                                                            <th>Document Number</th>
                                                            <th>Status</th>
                                                            <th>Uploaded At</th>
                                                            <th>View</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {existingDocuments.map(doc => (
                                                            <tr key={doc.id}>
                                                                <td>{doc.doc_type}</td>
                                                                <td>{doc.file_label}</td>
                                                                <td>{doc.document_number || '-'}</td>
                                                                <td>{doc.status}</td>
                                                                <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                                                                <td>
                                                                    <a href={`${IMAGE_BASE_URL}${doc.file_url}`} target="_blank" rel="noreferrer">View</a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            )}
                                        </div>
                                        <p>Please ensure all required documents are uploaded. Front and back copies are mandatory where applicable.</p>
                                        <div className="d-flex justify-content-between mt-3">
                                            <Button variant="secondary" onClick={() => setTabKey('driverInfo')}>Back</Button>
                                            <div>
                                                <Button variant="primary" className="me-2" onClick={() => handleSaveTab('Driver Documents')}>Save Changes</Button>
                                                <Button variant="success" onClick={() => setTabKey('vehicleInfo')}>Submit All Document</Button>
                                            </div>
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
                                        </Row>

                                        <Row>
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
                                                        <option value="Yes">Owned</option>
                                                        <option value="No">Rented</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        {/* Vehicle Documents with expiry date */}
                                        {['RC', 'Insurance', 'Permit', 'PUC', "Fitness"].map((label) => {
                                            const isDocWithExpiry = ['RC', 'Insurance', 'Permit', 'PUC'].includes(label);
                                            return (
                                                <Row key={label}>
                                                    <Col md={isDocWithExpiry ? 4 : 6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>{label} Document</Form.Label>
                                                            <Form.Control
                                                                type="file"
                                                                onChange={(e) =>
                                                                    setVehicleDocuments(prev => [
                                                                        ...prev.filter(d => d.file_label !== label),
                                                                        {
                                                                            doc_type: label.charAt(0).toUpperCase() + label.slice(1),
                                                                            document: e.target.files[0],
                                                                            file_label: label.charAt(0).toUpperCase() + label.slice(1),
                                                                            expiry_date: prev.find(d => d.file_label === label)?.expiry_date || ''
                                                                        }
                                                                    ])
                                                                }
                                                            />
                                                        </Form.Group>
                                                    </Col>

                                                    {label === 'RC' && (
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
                                                    )}

                                                    {isDocWithExpiry && (
                                                        <Col md={4}>
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
                                                    )}
                                                </Row>

                                            );
                                        })}
                                        <Row>
                                            {['Front', 'Back', 'Left', 'Right', 'Meter'].map((label) => (
                                                <Col md={4} key={label} className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label>{label} Image</Form.Label>
                                                        <Form.Control
                                                            type="file"
                                                            onChange={(e) =>
                                                                setVehicleDocuments(prev => [
                                                                    ...prev.filter(d => d.file_label !== label),
                                                                    { doc_type: label, document: e.target.files[0], file_label: label }
                                                                ])
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
                                                        onChange={(e) => {
                                                            const value = e.target.value.toUpperCase(); // Convert to uppercase automatically
                                                            const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/; // IFSC pattern
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
