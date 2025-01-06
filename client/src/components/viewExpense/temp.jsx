import { Swiper, SwiperSlide } from 'swiper/react';
import { SlideLine, SlidePie, Transports } from '../../utils/components';
import { Pagination } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import 'swiper/css/pagination';
import 'swiper/css';
import { addDays, format, startOfWeek } from 'date-fns';

const SlidePieContainer = ({ data }) => {
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

const SlideLineContainer = ({ text }) => {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 0 });
  const xAxis = Array.from({ length: 7 }, (_, i) =>
    format(addDays(start, i), 'EEE')
  );
  const income = [200, 300, 150, 400, 100, 50, 0];
  const outcome = [100, 200, 50, 300, 80, 60, 20];

  return <SlideLine data={{ income, outcome, xAxis }} text={text} />;
};

const Swipe = ({ data, type }) => {
  const { t } = useTranslation();
  const analytics = t('view.analytics.text', { returnObjects: true });
  const { totalIncome, totalOutcome, income, outcome } = data;

  return (
    <Swiper pagination={true} modules={[Pagination]} className="my-swiper">
      <SwiperSlide>
        {type == 'pie' && (
          <SlidePieContainer data={{ totalIncome, totalOutcome }} />
        )}
        {type == 'line' && <SlideLineContainer text={analytics.inOut} />}
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
