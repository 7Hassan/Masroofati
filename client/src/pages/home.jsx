import { useEffect, useMemo, useState } from 'react';
import Header from '../components/header/header';
import { useTranslation } from 'react-i18next';
import ViewExpense from '../components/viewExpense/view';
import AddExpense from '../components/addExpense/add';
import { Chooser, Loading } from '../utils/components';
import { url } from '../utils/variables';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const { t } = useTranslation();
  const auth = t('auth', { returnObjects: true });

  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="auth row">
      <button
        className="btn login-btn"
        onClick={() => handleNavigation('/login')}
      >
        <div className="h5">{auth.login}</div>
      </button>
      <button
        className="btn bg signup-btn"
        onClick={() => handleNavigation('/signup')}
      >
        <div className="h5">{auth.signup}</div>
      </button>
    </div>
  );
};

const AnimatedSec = ({ data, setUserData }) => {
  const { t } = useTranslation();
  const nav = t('nav', { returnObjects: true });
  const [sec, setSec] = useState(nav[0]?.code || '');
  const [isAnimating, setIsAnimating] = useState(false);

  const { isGuest, analyticsData, transData } = data;

  const handleSectionChange = (newSection) => {
    if (newSection !== sec) {
      setIsAnimating(true);
      setTimeout(() => {
        setSec(newSection);
        setIsAnimating(false);
      }, 300);
    }
  };

  const sections = useMemo(
    () => ({
      add: <AddExpense data={analyticsData} />,
      view: <ViewExpense data={transData} setUserData={setUserData} />,
    }),
    [analyticsData, transData]
  );

  return (
    <main>
      <Chooser
        setItem={handleSectionChange}
        activeItem={sec}
        list={nav}
        classes="add-home slide-parent"
      />
      <div className={`active-section ${isAnimating ? 'fade-out' : 'fade-in'}`}>
        {isGuest && <Auth />}
        {sections[sec]}
      </div>
    </main>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const pageErr = t('pageErr', { returnObjects: true });
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch(`${url}/api/data`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.msg);
        setUserData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setUserData(null);
        setLoading(false);
      });
  }, [loading]);

  if (loading) {
    return (
      <div className="home loading">
        <Loading type="page" />
      </div>
    );
  }

  if (!loading && !userData) {
    return (
      <div className="home page-err">
        <Header />
        <div className="error">{pageErr}</div>
      </div>
    );
  }

  return (
    <div className="home">
      <Header />
      <AnimatedSec data={userData} setUserData={setUserData} />
    </div>
  );
};

export default Home;
