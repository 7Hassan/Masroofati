import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import './header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { Loading } from '../../utils/components';
import { url } from '../../utils/variables';
import { message } from 'antd';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lng = i18n.language;
    const direction = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', lng);
  }, [i18n.language]);

  const changeLanguage = () => {
    const lng = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(lng);
  };

  return (
    <button onClick={changeLanguage} className="lang row btn">
      <div className="h5">{i18n.language === 'ar' ? 'En' : 'Ar'}</div>
    </button>
  );
};

const Logo = () => {
  const { t } = useTranslation();
  const logo = t('header.logo', { returnObjects: true });

  return (
    <div className="logos">
      <img src={logo.img.src} alt={logo.img.alt} loading="lazy" />
    </div>
  );
};

const Logout = ({ setUserData, messageApi }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const logout = t('logout');

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    fetch(`${url}/api/logout`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.msg);
        setLoading(false);
        setUserData(null);
      })
      .catch((error) => {
        setLoading(false);
        messageApi.error({ content: error.message, duration: 5 });
      });
  };

  return (
    <button onClick={handleSubmit} className="logout row btn">
      {!loading && <FontAwesomeIcon icon={faSignOut} />}
      {loading && <Loading type="red" />}
    </button>
  );
};

const Header = ({ isGuest, setUserData }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();
  const logo = t('header.logo', { returnObjects: true });

  return (
    <header>
      {contextHolder}
      <div className="container row">
        {(isGuest || isGuest == undefined) && <Logo />}
        {isGuest == false && (
          <Logout setUserData={setUserData} messageApi={messageApi} />
        )}

        <img
          src={logo.textLogo.src}
          alt={logo.textLogo.alt}
          className="text-logo"
          loading="lazy"
        />
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Header;
