import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {  useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ActionButton, Head } from '../utils/components';
import { url } from '../utils/variables';
import { message } from 'antd';
import './signup.scss';
import './add.scss';


const Signup = ({ messageApiApp }) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const formTr = t('signup.form', { returnObjects: true });
  const head = t('signup.head', { returnObjects: true });
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
    showPassword: false,
  });

  const [errors, setErrors] = useState({
    phoneNumber: '',
    password: '',
  });

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.phoneNumber &&
    formData.password &&
    !errors.phoneNumber &&
    !errors.password;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'phoneNumber') {
      const isNumeric = /^\d+$/.test(value);
      setErrors((prev) => ({
        ...prev,
        phoneNumber: !isNumeric && value ? formTr.phoneNumber.err : '',
      }));
    }

    if (field === 'password') {
      setErrors((prev) => ({
        ...prev,
        password: value.length < 8 ? formTr.password.err : '',
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;
    setLoading(true);

    fetch(`${url}/auth/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.msg);
        setLoading(false);
        messageApiApp.success(formTr.msgSignup);
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        messageApi.error({ content: error.message, duration: 5 });
      });
  };

  return (
    <div className="signup add">
      {contextHolder}
      <Head head={head} />
      <div className="form-container signupForm">
        <form onSubmit={handleSubmit}>
          {/* First Name Input */}
          <div className="form-card">
            <label className="h5">{formTr.firstName.label}</label>
            <input
              className="input-field"
              type="text"
              placeholder={formTr.firstName.pl}
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
            />
          </div>

          {/* Last Name Input */}
          <div className="form-card">
            <label className="h5">{formTr.lastName.label}</label>
            <input
              className="input-field"
              type="text"
              placeholder={formTr.lastName.pl}
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
            />
          </div>

          {/* Phone Number Input */}
          <div className="form-card">
            <label className="h5">{formTr.phoneNumber.label}</label>
            <input
              className="input-field"
              type="tel"
              placeholder={formTr.phoneNumber.pl}
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            />
            {errors.phoneNumber && (
              <span className="error-form">{errors.phoneNumber}</span>
            )}
          </div>

          {/* Password Input */}
          <div className="form-card">
            <label className="h5">{formTr.password.label}</label>
            <div className="password-wrapper">
              <input
                className="input-field"
                type={formData.showPassword ? 'text' : 'password'}
                placeholder={formTr.password.pl}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon
                  icon={formData.showPassword ? faEye : faEyeSlash}
                />
              </button>
            </div>
            {errors.password && (
              <span className="error-form">{errors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <div className="action row input">
            <ActionButton
              loading={loading}
              disabled={!isFormValid}
              text={formTr.btn}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
