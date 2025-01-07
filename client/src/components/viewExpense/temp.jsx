import { Swiper, SwiperSlide } from 'swiper/react';
import { SlideLine, SlidePie, Transports } from '../../utils/components';
import { Pagination } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import { addDays, format, getDaysInMonth, startOfWeek } from 'date-fns';
import { daysData, monthsData, weeksData } from '../../utils/variables';
import 'swiper/css/pagination';
import 'swiper/css';

const SlideLineTemp = ({ incomeValues, outcomeValues, text, xAxis }) => {
  const income = incomeValues;
  const outcome = outcomeValues;

  return <SlideLine data={{ income, outcome, xAxis }} text={text} />;
};
const SlideLineMonth = ({ text }) => {
  const xAxis = ['week1', 'week2', 'week3', 'week4'];
  const income = [200, 300, 150, 400];
  const outcome = [100, 200, 50, 300];

  return <SlideLine data={{ income, outcome, xAxis }} text={text} />;
};

const SlidePieDay = ({ data }) => {
  const { t } = useTranslation();
  const analytics = t('view.analytics.text', { returnObjects: true });
  const InOutCome = [
    {
      _id: 0,
      label: analytics.out,
      value: data.totalOutcome,
      color: '#E42F4C',
    },
    { _id: 1, label: analytics.in, value: data.totalIncome, color: '#2ECC71' },
  ];
  return <SlidePie data={InOutCome} text={analytics.inOut} />;
};

const Swipe = ({ data, type }) => {
  const { t } = useTranslation();
  const analytics = t('view.analytics.text', { returnObjects: true });
  const daysInMonth = Math.ceil(getDaysInMonth(new Date()) / 7);
  const { totalIncome, totalOutcome, income, outcome } = data;
  const xAxis =
    type == 'week'
      ? daysData
      : type == 'month'
      ? weeksData.slice(0, daysInMonth)
      : monthsData;
  return (
    <Swiper pagination={true} modules={[Pagination]} className="my-swiper">
      <SwiperSlide>
        {type == 'day' && <SlidePieDay data={{ totalIncome, totalOutcome }} />}
        {type != 'day' && (
          <SlideLineTemp
            incomeValues={data.incomeValues}
            outcomeValues={data.outcomeValues}
            xAxis={xAxis}
            text={analytics.inOut}
          />
        )}
        {/* {type == 'month' && <SlideLineMonth text={analytics.inOut} />} */}
      </SwiperSlide>
      <SwiperSlide>
        {<SlidePie data={outcome} text={analytics.out} />}
      </SwiperSlide>
      <SwiperSlide>
        {<SlidePie data={income} text={analytics.in} />}
      </SwiperSlide>
    </Swiper>
  );
};

const TempView = ({ data, type }) => {
  const { income, outcome } = data;

  return (
    <div className="temp-view">
      <Swipe data={data} type={type} />
      <Transports
        allTrans={[...income, ...outcome]}
        incomeTrans={income}
        outcomeTrans={outcome}
      />
    </div>
  );
};

export default TempView;
