import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Chooser, PieChartEle } from '../../utils/components';
import { useState } from 'react';
import { format } from 'date-fns';
import { IncomeIcon, OutcomeIcon } from '../eles';

const data = [
  { label: 'الدخل', value: 200, color: '#2ECC71' },
  { label: 'الصرف', value: 300, color: '#E42F4C' },
];

const Slide = () => {
  return (
    <div className="slide">
      <h4 className="title">الصرف - الدخل</h4>
      <PieChartEle data={data} />
    </div>
  );
};

const Swipe = () => {
  return (
    <Swiper pagination={true} modules={[Pagination]} className="my-swiper">
      <SwiperSlide>{<Slide />}</SwiperSlide>
      <SwiperSlide>{<Slide />}</SwiperSlide>
      <SwiperSlide>{<Slide />}</SwiperSlide>
    </Swiper>
  );
};

const DayTrans = ({ data }) => {
  const { type, price, date, reason } = data;
  return (
    <div className="day-trans row">
      {type == 'income' && <IncomeIcon />}
      {type == 'outcome' && <OutcomeIcon />}
      <div className="amount text">{price} EG</div>
      <div className="day text">{format(date, 'dd/MM/yyyy')}</div>
      <div className="reason text">{reason}</div>
    </div>
  );
};

const All = ({ list }) => {
  return (
    <div className="all-trans">
      <div className="container">
        {list.map((item) => (
          <DayTrans data={item} />
        ))}
      </div>
    </div>
  );
};

const DayView = () => {
  // const { t } = useTranslation();
  // const nav = t('nav', { returnObjects: true });
  const [sec, setSec] = useState('outcome');
  const [isAnimating, setIsAnimating] = useState(false);
  const allList = [
    { type: 'income', price: '300', date: new Date(), reason: 'schoola' },
  ];
  const incomeList = [
    { type: 'income', price: '300', date: new Date(), reason: 'schoola' },
  ];
  const outcomeList = [
    { type: 'income', price: '300', date: new Date(), reason: 'schoola' },
  ];
  const sections = {
    all: <All list={allList} />,
    income: <All list={incomeList} />,
    outcome: <All list={outcomeList} />,
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
    <div className="day">
      <Swipe />

      <div className="transported">
        <h4 className="title">المعاملات</h4>
        <Chooser
          setItem={handleSectionChange}
          activeItem={sec}
          classes={'chooser-trans slide-parent'}
          list={[
            {
              name: 'الصرف',
              code: 'outcome',
            },
            {
              name: 'الدخل',
              code: 'income',
            },
            {
              name: 'الكل',
              code: 'all',
            },
          ]}
        />
        <div
          className={`active-section ${isAnimating ? 'fade-out' : 'fade-in'}`}
        >
          {sections[sec]}
        </div>
      </div>
    </div>
  );
};

export default DayView;
