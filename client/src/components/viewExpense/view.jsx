import { useTranslation } from 'react-i18next';
import './view.scss';
import { Chooser } from '../../utils/components';
import { useState } from 'react';
import TempView from './temp';

const ViewExpense = ({ data }) => {
  const { t } = useTranslation();
  const chooser = t('view.chooser', { returnObjects: true });
  const [sec, setSec] = useState(chooser[0].code);
  const [isAnimating, setIsAnimating] = useState(false);


  const sections = {
    day: <TempView data={data.day} type="day" />,
    week: <TempView data={data.week} type="week" />,
    month: <TempView data={data.month} type="month" />,
    year: <TempView data={data.year} type="year" />,
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
          list={chooser}
        />
      </div>
      <div className={`active-section ${isAnimating ? 'fade-out' : 'fade-in'}`}>
        {sections[sec]}
      </div>
    </div>
  );
};

export default ViewExpense;
