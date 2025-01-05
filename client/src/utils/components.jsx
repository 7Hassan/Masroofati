import { LoadingColor, loading, loadingRed } from '../assets/images';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import classNames from 'classnames';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

export const Loading = ({ type }) => {
  return (
    <>
      {type === 'white' && (
        <img src={loading} alt="loading" className="loading" />
      )}
      {type === 'color' && (
        <img src={LoadingColor} alt="loading" className="loading" />
      )}
      {type === 'red' && (
        <img src={loadingRed} alt="loading" className="loading" />
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
          { 'active-btn': isActive }
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

export const PieChartEle = ({ data }) => {
  const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);
  const sizing = {
    margin: { right: 5 },
    width: 200,
    height: 200,
    legend: { hidden: true },
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
            data,
            arcLabel: getArcLabel,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: 'white',
            fontSize: 14,
          },
        }}
        {...sizing}
      />
      <div className="text row wrap">
        {data.map((item) => (
          <div className="item row" key={item.id}>
            <div
              className="color"
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="label h5">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};


