import { useEffect, useMemo, useState } from 'react';
import Header from '../components/header/header';
import { useTranslation } from 'react-i18next';
import ViewExpense from '../components/viewExpense/view';
import AddExpense from '../components/addExpense/add';
import { Chooser, Head, Loading } from '../utils/components';
import { url } from '../utils/variables';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import './home.scss';
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

const AuthIntro = ({ setUserData }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const homeIntro = t('homeIntro', { returnObjects: true });
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    fetch(`${url}/api/guest`, {
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
        setLoading(false);
        messageApi.error({ content: error.message, duration: 5 });
      });
  };

  return (
    <>
      <Header />
      <div className="bre-intro center">
        {contextHolder}
        <div className="container">
          <Head head={homeIntro.auth.head} />
          <Auth />
          <div className="skip row">
            <button className="btn login-btn" onClick={() => handleSubmit()}>
              <div className="h5">
                {!loading && <h5>{homeIntro.auth.skip}</h5>}
                {loading && <Loading type="color" />}
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const pageErr = t('pageErr', { returnObjects: true });
  const homeIntro = t('homeIntro', { returnObjects: true });
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
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="home loading">
        <Loading type="page" />
      </div>
    );
  }

  // if (!loading && !userData) {
  //   return (
  //     <>
  //       <Header />
  //       <div>
  //         <div className="error">{pageErr}</div>
  //       </div>
  //     </>
  //   );
  // }

  if (!loading && !userData) return <AuthIntro setUserData={setUserData} />;

  return (
    <div className="home">
      <Header />
      <AnimatedSec data={userData} setUserData={setUserData} />
    </div>
  );
};

export default Home;
