import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    if (!formData.firstName) {
      toast.error('First name is required.');
      return false;
    } else if (formData.firstName.length < 2) {
      toast.error('First name must be at least 2 characters.');
      return false;
    }
    if (!formData.lastName) {
      toast.error('Last name is required.');
      return false;
    } else if (formData.lastName.length < 2) {
      toast.error('Last name must be at least 2 characters.');
      return false;
    }
    if (!formData.phoneNumber) {
      toast.error('Phone number is required.');
      return false;
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber)) {
      toast.error('Invalid phone number.');
      return false;
    }
    if (!formData.password) {
      toast.error('Password is required.');
      return false;
    } else if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Simulate API call success
      toast.success('Form submitted successfully!');
      console.log('Form Submitted:', formData);
    }
  };

  return (
    <div>
      <ToastContainer />
      <h2>Signup Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            className="input-field"
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            className="input-field"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            className="input-field"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="input-field"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="action">
          <button type="submit" className="btn bg stretch">
            <h4>Sign up</h4>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
