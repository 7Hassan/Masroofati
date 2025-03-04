import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // Ensure correct import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './add.scss';
import './signup.scss'; // Rename the CSS file if necessary
import './login.scss'; // Rename the CSS file if necessary
import { ActionButton, Head } from '../utils/components';
import { url } from '../utils/variables';
import { message } from 'antd';

const Login = ({ messageApiApp }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const formTr = t('login.form', { returnObjects: true });
  const head = t('login.head', { returnObjects: true });

  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    showPassword: false,
  });
  const [loading, setLoading] = useState(false);

  const isFormValid = formData.phoneNumber && formData.password;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = () => {
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;
    setLoading(true);

    fetch(`${url}/auth/login`, {
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
        messageApiApp.success(formTr.msgLogin);
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        messageApi.error({ content: error.message, duration: 5 });
      });
  };

  return (
    <div className="login signup add">
      {contextHolder}
      <Head head={head} />
      <div className="form-container signupForm">
        <form onSubmit={handleSubmit}>
          <div className="form-card">
            <label className="h5">{formTr.phoneNumber.label}</label>
            <input
              className="input-field"
              type="tel"
              placeholder={formTr.phoneNumber.pl}
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            />
          </div>

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
          </div>

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

export default Login;
