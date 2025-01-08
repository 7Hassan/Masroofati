import React, { useState } from 'react';
import './add.scss';
import { Chooser, ActionButton } from '../../utils/components';
import { url } from '../../utils/variables';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { format } from 'date-fns';

const ExpenseForm = ({ labels }) => {
  const { t } = useTranslation();
  const formTr = t('addForm.form', { returnObjects: true });
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    value: '',
    type: 'outcome',
    date: new Date().toISOString().split('T')[0], // default to today
    label: '',
  });

  const isFormValid = formData.value > 0 && formData.label.trim().length > 0;

  const handleInputChange = (field, value) => {
    if (field === 'value' && value < 0) {
      messageApi.error({ content: formTr.valueIn.err, duration: 5 });

      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      if (formData.value <= 0) {
        messageApi.error({ content: formTr.valueIn.err, duration: 5 });
      }
      if (!formData.label.trim()) {
        messageApi.error({ content: formTr.labelIn.err, duration: 5 });
      }
      return;
    }
    setLoading(true);
    fetch(`${url}/api/add`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (!data.success) throw new Error(data.msg);
        const msg = formData.type == 'outcome' ? formTr.msgout : formTr.msgin;
        messageApi.error({ content: msg, duration: 5 });
      })
      .catch((error) => {
        setLoading(false);
        messageApi.error({ content: error.message, duration: 5 });
      });
  };

  return (
    <div className="form-container">
      {contextHolder}
      <form onSubmit={handleSubmit}>
        <div className="form-card">
          <Chooser
            setItem={(type) => handleInputChange('type', type)}
            activeItem={formData.type}
            list={formTr.types}
          />
        </div>

        {/* Value Input */}
        <div className="form-card">
          <label className="h5">{formTr.valueIn.label}</label>
          <input
            className="input-field"
            type="number"
            placeholder={formTr.valueIn.pl}
            value={formData.value}
            onChange={(e) =>
              handleInputChange('value', parseFloat(e.target.value) || '')
            }
          />
        </div>

        {/* Date Input */}
        <div className="form-card">
          <label className="h5">{formTr.day}</label>
          <input
            type="date"
            className="input-field"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
          />
        </div>

        {/* Label Input */}
        <div className="form-card">
          <label className="h5">{formTr.sourceIn.label}</label>
          <input
            type="text"
            className="input-field"
            placeholder={formTr.sourceIn.pl}
            value={formData.label}
            onChange={(e) => handleInputChange('label', e.target.value)}
          />
          <ul className="source-list">
            {labels.map((src, index) => (
              <li
                key={index}
                className={formData.label === src ? 'high-light' : ''}
                onClick={() => handleInputChange('label', src)}
              >
                <span>{src}</span>
              </li>
            ))}
          </ul>
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
  );
};

export default ExpenseForm;
