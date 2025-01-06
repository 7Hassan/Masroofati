import { useTranslation } from 'react-i18next';
import './view.scss';
import { Chooser } from '../../utils/components';
import { useState } from 'react';
import TempView from './temp';

const ViewExpense = () => {
  const { t } = useTranslation();
  const chooser = t('view.chooser', { returnObjects: true });
  const [sec, setSec] = useState(chooser[1].code);
  const [isAnimating, setIsAnimating] = useState(false);
  const data = {
    totalIncome: 100,
    totalOutcome: 200,
    income: [
      {
        _id: '677b96264c1ae97ad664c805',
        label: 'schoola',
        value: 200,
        color: '#2ECC71',
        type: 'income',
        date: '2025-01-05T22:00:00.000Z',
      },
      {
        _id: '677b96264c1a97ad664c805',
        label: 'schoola',
        value: 50,
        color: '#2ECC71',
        type: 'income',
        date: '2025-01-05T22:00:00.000Z',
      },
    ],
    outcome: [
      {
        _id: '677b96264c1ae97ad664c905',
        label: 'schoola',
        value: 200,
        color: '#2ECC71',
        type: 'outcome',
        date: '2025-01-05T22:00:00.000Z',
      },
      {
        _id: '677b96264c1ae97ad664c705',
        label: 'schoola',
        value: 100,
        color: '#2ECC71',
        type: 'outcome',
        date: '2025-01-05T22:00:00.000Z',
      },
    ],
  };

  const sections = {
    day: <TempView data={data} type="day" />,
    week: <TempView data={data} type="week" />,
    month: <TempView data={data} type="month" />,
    year: <TempView data={data} type="year" />,
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
