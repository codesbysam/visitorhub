import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const VisitorForm = ({ isOpen, onClose, onSubmit, initialData, isInline = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    companyName: '',
    personToMeet: '',
    purpose: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        mobileNumber: '',
        companyName: '',
        personToMeet: '',
        purpose: ''
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen && !isInline) return null;

  const formContent = (
    <div className={`modal-content glass-panel ${isInline ? 'inline-form' : ''}`}>
      <div className="modal-header">
        <h2>{initialData ? 'Edit Visitor' : 'New Visitor Registration'}</h2>
        {!isInline && (
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        )}
      </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              className="input-field"
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input 
              type="text" 
              id="mobileNumber" 
              name="mobileNumber" 
              className="input-field"
              value={formData.mobileNumber} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="companyName">Company / College Name</label>
            <input 
              type="text" 
              id="companyName" 
              name="companyName" 
              className="input-field"
              value={formData.companyName} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="personToMeet">Person to Meet</label>
            <input 
              type="text" 
              id="personToMeet" 
              name="personToMeet" 
              className="input-field"
              value={formData.personToMeet} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="purpose">Purpose of Visit</label>
            <input 
              type="text" 
              id="purpose" 
              name="purpose" 
              className="input-field"
              value={formData.purpose} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            {!isInline && (
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              {initialData ? 'Save Changes' : 'Register Visitor'}
            </button>
          </div>
        </form>
      </div>
  );

  if (isInline) {
    return formContent;
  }

  return (
    <div className="modal-overlay">
      {formContent}
    </div>
  );
};

export default VisitorForm;
