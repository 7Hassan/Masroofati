import { useState } from 'react';
import Header from '../components/header/header';
import { useTranslation } from 'react-i18next';
import ViewExpense from '../components/view expense/view';
import AddExpense from '../components/add Expense/add';

const Home = () => {
  const { t } = useTranslation();
  const nav = t('nav', { returnObjects: true });
  const [activeSection, setActiveSection] = useState(nav[0].code);

  const sections = {
    add: <AddExpense />,
    view: <ViewExpense />,
  };

  return (
    <div className="home">
      <Header />
      <main>
        <div className="navBar row choose-bar">
          {nav.map((item) => (
            <div
              className={
                activeSection === item.code
                  ? 'active-btn nav-btn  h4 item row'
                  : 'nav-btn  h4 item row'
              }
              key={item.code}
              onClick={() => setActiveSection(item.code)}
            >
              {item.name}
            </div>
          ))}
        </div>
        <div className="content">{sections[activeSection]}</div>
      </main>
    </div>
  );
};

export default Home;
