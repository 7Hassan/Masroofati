import { useEffect, useMemo, useState } from 'react';
import Header from '../components/header/header';
import { useTranslation } from 'react-i18next';
import ViewExpense from '../components/viewExpense/view';
import AddExpense from '../components/addExpense/add';
import { Chooser, Loading } from '../utils/components';
import { url } from '../utils/variables';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();

  return (
    <div className="auth row">
      <button className="btn login-btn" onClick={() => navigate('/login')}>
        <div className="h5"> Login</div>
      </button>
      <button className="btn bg signup-btn" onClick={() => navigate('/signup')}>
        <div className="h5"> Sign Up</div>
      </button>
    </div>
  );
};

const AnimatedSec = ({ data }) => {
  const { t } = useTranslation();
  const nav = t('nav', { returnObjects: true });
  const [sec, setSec] = useState(nav[1].code);
  const [isAnimating, setIsAnimating] = useState(false);
  const { analyticsData } = data;

  const handleSectionChange = (newSection) => {
    if (newSection !== sec) {
      setIsAnimating(true);
      setTimeout(() => {
        setSec(newSection);
        setIsAnimating(false);
      }, 300);
    }
  };
  const sections = {
    add: <AddExpense data={analyticsData} />,
    view: <ViewExpense data={data.transData} />,
  };

  return (
    <main>
      <Chooser
        setItem={handleSectionChange}
        activeItem={sec}
        list={nav}
        classes="add-home"
      />
      <div className={`active-section ${isAnimating ? 'fade-out' : 'fade-in'}`}>
        {/* {!isAuth && <Auth />} */}
        {sections[sec]}
      </div>
    </main>
  );
};
const Home = () => {
  const [userData, setUserData] = useState(null);
  const loading = useMemo(() => !userData, [userData]);

  useEffect(() => {
    fetch(`${url}/api/data`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => res.json())
      .then((res) => {
        if (res.success) setUserData(res.data);
        else throw new Error(res.data.msg);
      })
      .catch(() => 0);
  }, []);

  return (
    <div className={`home ${loading && 'loading'}`}>
      {!loading && (
        <>
          <Header />
          <AnimatedSec data={userData} />
        </>
      )}
      {loading && <Loading type="color" />}
    </div>
  );
};

export default Home;
