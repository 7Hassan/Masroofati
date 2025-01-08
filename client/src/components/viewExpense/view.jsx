import { useTranslation } from 'react-i18next';
import './view.scss';
import { Chooser } from '../../utils/components';
import { useState } from 'react';
import TempView from './temp';

const ViewExpense = ({ data, setUserData }) => {
  const { t } = useTranslation();
  const chooser = t('view.chooser', { returnObjects: true });
  const [sec, setSec] = useState(chooser[1].code);
  const [isAnimating, setIsAnimating] = useState(false);

  const sections = {
    day: (
      <TempView
        data={data.day}
        type="day"
        text={chooser[0].name}
        setUserData={setUserData}
      />
    ),
    week: (
      <TempView
        data={data.week}
        text={chooser[1].name}
        type="week"
        setUserData={setUserData}
      />
    ),
    month: (
      <TempView
        data={data.month}
        type="month"
        text={chooser[2].name}
        setUserData={setUserData}
      />
    ),
    year: (
      <TempView
        data={data.year}
        type="year"
        text={chooser[3].name}
        setUserData={setUserData}
      />
    ),
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
