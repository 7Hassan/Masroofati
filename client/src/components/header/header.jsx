import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import './header.scss';


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
    <div className="logos row">
      <img src={logo.img.src} alt={logo.img.alt} loading="lazy" />
      <img
        src={logo.textLogo.src}
        alt={logo.textLogo.alt}
        className="text-logo"
        loading="lazy"
      />
    </div>
  );
};

const Header = () => {
  return (
    <header>
      <div className="container row">
        <Logo />
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Header;
