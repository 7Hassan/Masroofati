import { useTranslation } from 'react-i18next';
import './add.scss';
import { Link, useNavigate } from 'react-router-dom'; // Ensure correct import
import { useState } from 'react';

const Head = () => {
  const { t } = useTranslation();
  const head = t('add.head', { returnObjects: true });

  return (
    <div className="header">
      <Link to={head.img.url}>
        <div className="img">
          <img src={head.img.link} alt={head.img.alt} />
        </div>
      </Link>
      <h4 className="welcome">{head.dis.head}</h4>
      <h5 className="text-light">{head.dis.dis}</h5>
    </div>
  );
};

const TypeofMoney = ({ list, active, setActive }) => (
  <div className="type row choose-bar">
    {list.map((item) => (
      <div
        key={item.code}
        className={`nav-btn h4 item row ${
          active === item.code ? 'active-btn' : ''
        }`}
        onClick={() => setActive(item.code)}
      >
        {item.name}
      </div>
    ))}
  </div>
);

const Form = () => {
  const { t } = useTranslation();
  const formTr = t('add.form', { returnObjects: true });
  const [activeType, setActiveType] = useState(formTr.types?.[0]?.code || '');
  const [activeCategory, setActiveCategory] = useState(
    formTr.categories?.[0]?.code || ''
  );

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ amount: '', reason: '' });
  const isDisabledForm = !(form.amount && form.reason); // Validate form

  const handleChange = (name, value) => setForm({ ...form, [name]: value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDisabledForm) return;
    setLoading(true);

    // Simulate submission or API call
    setTimeout(() => {
      setLoading(false);
      navigate('/success'); // Replace with actual logic
    }, 1000);
  };

  return (
    <div className="form">
      <form action="POST" onSubmit={handleSubmit}>
        <div className="input">
          <input
            type="number"
            placeholder="Amount"
            className="input-field"
            name="amount"
            value={form.amount}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          />
        </div>
        <div className="input">
          <TypeofMoney
            setActive={setActiveType}
            active={activeType}
            list={formTr.types || []}
          />
        </div>
        <div className="input">
          {' '}
          <TypeofMoney
            setActive={setActiveCategory}
            active={activeCategory}
            list={formTr.categories || []}
          />
        </div>

        <div className="input">
          <input
            type="text"
            placeholder="Reason"
            className="input-field"
            name="reason"
            value={form.reason}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          />
        </div>
        <div className="action row input">
          <button
            type="submit"
            disabled={isDisabledForm}
            className={`action-button stretch bg ${
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

const Add = () => (
  <div className="add">
    <Head />
    <Form />
  </div>
);

export default Add;
