import { useTranslation } from 'react-i18next';
import './add.scss';
import { Link } from 'react-router-dom'; // Ensure correct import
import ExpenseForm from '../components/addForm/add';
import { useEffect, useState } from 'react';
import { url } from '../utils/variables';
import { Head } from '../utils/components';

const Add = ({ messageApi }) => {
  const { t } = useTranslation();
  const head = t('signup.head', { returnObjects: true });
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
      <Head head={head} />
      <ExpenseForm labels={user.labels || []} messageApi={messageApi} />
    </div>
  );
};

export default Add;
