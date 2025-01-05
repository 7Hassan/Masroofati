import { useTranslation } from 'react-i18next';
import './view.scss';
import { Chooser } from '../../utils/components';
import { useState } from 'react';
import DayView from './day';

const Week = () => {
  return <div className="week">week</div>;
};
const Month = () => {
  return <div className="month">activeSection</div>;
};

const ViewExpense = () => {
  const { t } = useTranslation();
  const nav = t('nav', { returnObjects: true });
  const [sec, setSec] = useState('day');
  const [isAnimating, setIsAnimating] = useState(false);
  const sections = {
    day: <DayView />,
    week: <Week />,
    month: <Month />,
  };

  const handleSectionChange = (newSection) => {
    if (newSection !== sec) {
      setIsAnimating(true);
      setTimeout(() => {
        setSec(newSection);
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div className="view-expensed">
      <div className="head">
        <Chooser
          setItem={handleSectionChange}
          activeItem={sec}
          classes={'slide-parent'}
          list={[
            {
              name: 'يوم',
              code: 'day',
            },
            {
              name: 'الاسبوع',
              code: 'week',
            },
            {
              name: 'الشهر',
              code: 'month',
            },
          ]}
        />
      </div>
      <div className={`active-section ${isAnimating ? 'fade-out' : 'fade-in'}`}>
        {sections[sec]}
      </div>
    </div>
  );
};

export default ViewExpense;
