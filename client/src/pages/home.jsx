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

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="auth row">
      <button
        className="btn login-btn"
        onClick={() => handleNavigation('/login')}
      >
        <div className="h5">Login</div>
      </button>
      <button
        className="btn bg signup-btn"
        onClick={() => handleNavigation('/signup')}
      >
        <div className="h5">Sign Up</div>
      </button>
    </div>
  );
};

const AnimatedSec = ({ data }) => {
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
      view: <ViewExpense data={transData} />,
    }),
    [analyticsData, transData]
  );

  return (
    <main>
      <Chooser
        setItem={handleSectionChange}
        activeItem={sec}
        list={nav}
        classes="add-home"
      />
      <div className={`active-section ${isAnimating ? 'fade-out' : 'fade-in'}`}>
        {isGuest && <Auth />}
        {sections[sec]}
      </div>
    </main>
  );
};

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const pageErr = t('pageErr', { returnObjects: true });

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url}/api/data`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      setLoading(false);

      if (result.success) {
        setUserData(result.data);
      } else {
        console.error('Error:', result.data?.msg || 'Unknown error');
        setUserData(null);
      }
    } catch (error) {
      setLoading(false);
      console.error('Fetch Error:', error.message);
      setUserData(null);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="home loading">
        <Loading type="color" />
      </div>
    );
  }

  if (!userData) {
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
      <AnimatedSec data={userData} />
    </div>
  );
};

export default Home;
