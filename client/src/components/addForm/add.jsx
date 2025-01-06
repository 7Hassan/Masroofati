import React, { useState } from 'react';
import './add.scss';
import { Chooser } from '../../utils/components';

const ExpenseForm = () => {
  const [value, setvalue] = useState('');
  const [type, setType] = useState('outcome');
  const [date, setDate] = useState(new Date());
  const [source, setSource] = useState('');
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const isDisabledForm = !(value && label);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDisabledForm) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate('/success');
    }, 1000);
  };

  return (
    <div className="form-container">
      <form action="POST" onSubmit={handleSubmit}>
        <div className="form-card">
          <Chooser
            setItem={setType}
            activeItem={type}
            list={[
              {
                name: 'صرف',
                code: 'outcome',
              },
              {
                name: 'دخل',
                code: 'income',
              },
            ]}
          />
        </div>
        <div className="form-card">
          <label className="h5">المبلغ:</label>
          <input
            className="input-field"
            type="number"
            placeholder="أدخل المبلغ"
            value={value}
            onChange={(e) => setvalue(e.target.value)}
          />
        </div>
        <div className="form-card">
          <label className="h5">اليوم:</label>
          <input
            type="date"
            className="input-field"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-card">
          <label className="h5">المصدر/الوجهة:</label>
          <input
            type="text"
            className="input-field"
            placeholder="المصدر/الوجهة"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <ul className="source-list">
            {sources.map((src, index) => (
              <li
                key={index}
                className={source == src && 'high-light'}
                onClick={() => setSource(src)}
              >
                <span>{src}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="action row input">
          <button
            type="submit"
            disabled={isDisabledForm}
            className={`action-button stretch btn bg ${
              isDisabledForm && 'disabled'
            }`}
          >
            <h5>{loading ? 'Loading...' : 'Add'}</h5>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
