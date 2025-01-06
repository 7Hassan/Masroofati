import { useState } from 'react';
import Header from '../components/header/header';
import { useTranslation } from 'react-i18next';
import ViewExpense from '../components/viewExpense/view';
import AddExpense from '../components/addExpense/add';
import { Chooser } from '../utils/components';

const Home = () => {
  const { t } = useTranslation();
  const nav = t('nav', { returnObjects: true });
  const [sec, setSec] = useState(nav[1].code);
  const [isAnimating, setIsAnimating] = useState(false);

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
    add: <AddExpense />,
    view: <ViewExpense />,
  };

  return (
    <div className="home">
      <Header />
      <main>
        <Chooser setItem={handleSectionChange} activeItem={sec} list={nav} />
        <div
          className={`active-section ${isAnimating ? 'fade-out' : 'fade-in'}`}
        >
          {sections[sec]}
        </div>
      </main>
    </div>
  );
};

export default Home;
