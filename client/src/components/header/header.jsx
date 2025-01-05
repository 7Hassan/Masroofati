import { useTranslation } from 'react-i18next';
import './header.scss';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const arabic = i18n.language == 'ar';

  const changeLanguage = () => {
    const lng = arabic ? 'en' : 'ar';
    i18n.changeLanguage(lng);
  };

  return (
    <button onClick={changeLanguage} className="lang row btn">
      <div className="h4">{arabic ? 'En' : 'Ar'}</div>
    </button>
  );
};

const User = () => {
  return (
    <div className="user row">
      <div className="img">
        <img
          src="https://via.placeholder.com/800x400?text=Slide+1"
          alt="user image"
          loading="lazy"
        />
      </div>
    </div>
  );
};

const Header = () => {
  const { t } = useTranslation();
  const logo = t('header.logo', { returnObjects: true });

  return (
    <header>
      <div className="container row">
        <User />
        <div className="brand">
          <img src={logo.imgLink} alt={logo.alt} />
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Header;
