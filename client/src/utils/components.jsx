import { LoadingColor, loading, loadingRed } from '../assets/images';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import classNames from 'classnames';

import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

import { useState } from 'react';

import { IncomeIcon, OutcomeIcon } from '../components/eles';

import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { BarChart } from '@mui/x-charts';

export const Loading = ({ type }) => {
  return (
    <>
      {type === 'white' && (
        <img src="/icons/loading.png" alt="loading" className="spine" />
      )}
      {type === 'color' && (
        <img src={LoadingColor} alt="loading" className="spine" />
      )}
      {type === 'red' && (
        <img src={loadingRed} alt="loading" className="spine" />
      )}
      {type === 'page' && (
        <>
          <div className="loading loading-img">
            <img
              src="/icons/loading-logo.png"
              alt="loading"
              className="spine loading-page-img"
            />
          </div>

          <div className="loading">
            <img
              src="/icons/logo.png"
              alt="image"
              className="loading-page-img"
            />
          </div>
        </>
      )}
    </>
  );
};

export const Chooser = ({ setItem, activeItem, list, classes }) => {
  return (
    <div className={`choose-bar ${classes}`}>
      {list.map((listItem) => {
        const isActive = activeItem === listItem.code;

        const itemClass = classNames(
          'nav-btn',
          'h4',
          'item',
          'row',
          listItem.code,
          {
            'active-btn': isActive,
          }
        );

        return (
          <div
            key={listItem.code}
            className={itemClass}
            role="button"
            tabIndex="0"
            onClick={() => setItem(listItem.code)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setItem(listItem.code);
              }
            }}
          >
            {listItem.name}
          </div>
        );
      })}
    </div>
  );
};

const PieChartEle = ({ data }) => {
  const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

  const sizing = {
    margin: {
      left: 100,
    },

    width: 200,
    height: 200,
    legend: {
      hidden: true,
    },
  };

  const getArcLabel = (params) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="pie-chart">
      <PieChart
        series={[
          {
            outerRadius: 80,
            data: data, // Use enriched data with colors
            arcLabel: getArcLabel,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}

        `]: {
            fill: 'white',
            fontSize: 10,
            fontWeight: 800,
          },
        }}
        {...sizing}
      />
      <div className="text row wrap">
        {data.map((item) => (
          <div className="item row" key={item._id}>
            <div
              className="color"
              style={{
                backgroundColor: item.color, // Use the color from enrichedData
              }}
            ></div>
            <div className="label h5"> {item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SlidePie = ({ data, text }) => {
  return (
    <div className="slide">
      <h4 className="title"> {text}</h4>
      <PieChartEle data={data} />
    </div>
  );
};

const DayTrans = ({ data }) => {
  const { t } = useTranslation();
  const currency = t('currency', { returnObjects: true });
  const { type, value, date, label } = data;

  return (
    <div className="day-trans row">
      {type == 'income' && <IncomeIcon />}
      {type == 'outcome' && <OutcomeIcon />}
      <div className="value text">
        {value} {currency}
      </div>
      <div className="day text"> {format(new Date(date), 'dd/MM/yyyy')}</div>
      <div className="label text">{label}</div>
    </div>
  );
};

const List = ({ list }) => {
  return (
    <div className="all-trans">
      <div className="container">
        {list.map((item) => (
          <DayTrans data={item} key={item._id} />
        ))}
      </div>
    </div>
  );
};

export const Transports = ({ allTrans, incomeTrans, outcomeTrans }) => {
  const { t } = useTranslation();
  const trans = t('view.trans', { returnObjects: true });
  const [sec, setSec] = useState('outcome');
  const [isAnimating, setIsAnimating] = useState(false);

  const sections = {
    all: <List list={allTrans} />,
    income: <List list={incomeTrans} />,
    outcome: <List list={outcomeTrans} />,
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
    <div className="transported">
      <h4 className="title">{trans.text}</h4>
      <Chooser
        setItem={handleSectionChange}
        activeItem={sec}
        classes={'chooser-trans slide-parent'}
        list={trans.chooser}
      />
      <div className={`active-section ${isAnimating ? 'fade-out' : 'fade-in'}`}>
        {sections[sec]}
      </div>
    </div>
  );
};

const ChartLine = ({ data }) => {
  const { income, outcome, xAxis } = data;
  return (
    <div className="bar-chart">
      <BarChart
        xAxis={[
          {
            scaleType: 'band',
            data: xAxis,
          },
        ]}
        series={[
          {
            data: income,
            color: '#2ECC71',
          },
          {
            data: outcome,
            color: '#E42F4C',
          },
        ]}
        width={500}
        height={300}
      />
    </div>
  );
};

export const SlideLine = ({ data, text }) => {
  return (
    <div className="slide">
      <h4 className="title"> {text}</h4>
      <ChartLine data={data} />
    </div>
  );
};

export const ActionButton = ({ loading, text, disabled }) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`action-button stretch btn bg ${disabled && 'disabled'}`}
    >
      {!loading && <h5>{text}</h5>}
      {loading && <Loading type="white" />}
    </button>
  );
};
