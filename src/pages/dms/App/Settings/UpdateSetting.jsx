import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';

export const UpdateSetting = () => {
  const [updateSettings, setUpdateSettings] = useState({
    versionCode: '1.0.0', 
    downloadLink: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateSettings({ ...updateSettings, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Handle the update logic (API call or save to local storage)
  };

  return (
    <AdminLayout>
      <Container className='dms-container'>
        <h3>Update Settings</h3>
        <div className='dms-form-container'>
          <Form onSubmit={handleSubmit}>
            {/* Version Code */}
            <Form.Group className='dms-form-group' controlId="versionCode">
              <Form.Label>Version Code</Form.Label>
              <Form.Control
                type="text"
                name="versionCode"
                value={updateSettings.versionCode}
                onChange={handleChange}
                placeholder="Enter version code"
                required
                disabled={!isEditing}
              />
            </Form.Group>

            {/* Download Link */}
            <Form.Group className='dms-form-group' controlId="downloadLink">
              <Form.Label>Download Link</Form.Label>
              <Form.Control
                type="url"
                name="downloadLink"
                value={updateSettings.downloadLink}
                onChange={handleChange}
                placeholder="Enter download link"
                required
                disabled={!isEditing}
              />
            </Form.Group>

            {/* Edit / Save Button */}
            {isEditing ? (
              <Button type="submit">Save Settings</Button>
            ) : (
              <Button variant="secondary" onClick={handleEdit}>Edit</Button>
            )}
          </Form>
        </div>
      </Container>
    </AdminLayout>
  );
};
