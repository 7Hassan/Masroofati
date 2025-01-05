import { useState } from 'react';
import Header from '../components/header/header';
import { useTranslation } from 'react-i18next';
import ViewExpense from '../components/viewExpense/view';
import AddExpense from '../components/addExpense/add';
import { Chooser } from '../utils/components';

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
        <Chooser
          setItem={setActiveSection}
          activeItem={activeSection}
          list={nav}
        />
        <div className="content">{sections[activeSection]}</div>
      </main>
    </div>
  );
};

export default Home;
