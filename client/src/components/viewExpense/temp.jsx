import { Swiper, SwiperSlide } from 'swiper/react';
import { SlideLine, SlidePie, Transports } from '../../utils/components';
import { Pagination } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import { addDays, format, getDaysInMonth, startOfWeek } from 'date-fns';
import { daysData, monthsData, weeksData } from '../../utils/variables';
import 'swiper/css/pagination';
import 'swiper/css';

const SlideLineTemp = ({
  incomeValues,
  outcomeValues,
  text,
  xAxis,
  textSt,
}) => {
  const income = incomeValues;
  const outcome = outcomeValues;

  return (
    <SlideLine data={{ income, outcome, xAxis }} text={text} textSt={textSt} />
  );
};

const SlidePieDay = ({ data, textSt }) => {
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
  return <SlidePie data={InOutCome} text={analytics.inOut} textSt={textSt} />;
};

const Swipe = ({ data, type, text }) => {
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
        <div className="prevent-hover"></div>
        {type == 'day' && (
          <SlidePieDay data={{ totalIncome, totalOutcome }} textSt={text} />
        )}
        {type != 'day' && (
          <SlideLineTemp
            incomeValues={data.incomeValues}
            outcomeValues={data.outcomeValues}
            xAxis={xAxis}
            text={analytics.inOut}
            textSt={text}
          />
        )}
      </SwiperSlide>
      <SwiperSlide>
        <div className="prevent-hover"></div>
        {<SlidePie data={outcome} text={analytics.out} textSt={text} />}
      </SwiperSlide>
      <SwiperSlide>
        <div className="prevent-hover"></div>
        {<SlidePie data={income} text={analytics.in} textSt={text} />}
      </SwiperSlide>
    </Swiper>
  );
};

const TempView = ({ data, type, text, setUserData }) => {
  const { income, outcome } = data;

  return (
    <div className="temp-view">
      <Swipe data={data} type={type} text={text} />
      <Transports
        allTrans={[...income, ...outcome]}
        incomeTrans={income}
        outcomeTrans={outcome}
        setUserData={setUserData}
        text={text}
      />
    </div>
  );
};

export default TempView;
