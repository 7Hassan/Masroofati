import { useTranslation } from 'react-i18next';
import './add.scss';
import { Link } from 'react-router-dom'; // Ensure correct import
import ExpenseForm from '../components/addForm/add';
import { useEffect, useState } from 'react';
import { url } from '../utils/variables';

const Head = () => {
  const { t } = useTranslation();
  const head = t('signup.head', { returnObjects: true });

  return (
    <div className="header">
      <Link to={head.img.url}>
        <div className="img">
          <img src={head.img.src} alt={head.img.alt} />
        </div>
      </Link>
      <h4 className="welcome">{head.dis.head}</h4>
      <h5 className="text-light">{head.dis.dis}</h5>
    </div>
  );
};

const Add = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    fetch(`${url}/api/user`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => res.json())
      .then((res) => {
        if (res.success) setUser(res.data);
        else throw new Error(res.data.msg);
      })
      .catch(() => 0);
  }, []);

  return (
    <div className="add">
      <Head />
      <ExpenseForm labels={user.labels || []} />
    </div>
  );
};

export default Add;
