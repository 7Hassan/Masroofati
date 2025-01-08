import { useTranslation } from 'react-i18next';
import { IncomeIcon, OutcomeIcon } from '../eles';
import { Link } from 'react-router-dom';
import './add.scss';

const DayBudget = ({ income, outcome }) => {
  const { t } = useTranslation();
  const currency = t('currency');
  const month = t('add.day', { returnObjects: true });

  return (
    <div className="month-budget row">
      <div className="outcome  budget-box">
        <div className="text row">
          <div className="h5">{month.outcome}</div>
        </div>
        <div className="text row">
          <OutcomeIcon />
          <div className="h3">
            {outcome} {currency}
          </div>
        </div>
      </div>
      <div className="income budget-box">
        <div className="text row">
          <div className="h5">{month.income}</div>
        </div>
        <div className="text row">
          <IncomeIcon />
          <div className="h3">
            {income} {currency}
          </div>
        </div>
      </div>
    </div>
  );
};

const WeekMonBudget = ({ text, income, outcome }) => {
  const { t } = useTranslation();
  const currency = t('currency');
  return (
    <div className="week-day-budget">
      <div className="name h5">{text}</div>
      <div className="row">
        <div className="text row">
          <OutcomeIcon />
          <div className="h3">
            {outcome} {currency}
          </div>
        </div>
        <div className="text row">
          <IncomeIcon />
          <div className="h3">
            {income} {currency}
          </div>
        </div>
      </div>
    </div>
  );
};

const AddExpense = ({ data }) => {
  const { t } = useTranslation();
  const add = t('add', { returnObjects: true });

  return (
    <div className="add-expensed">
      <DayBudget income={data.monthIncome} outcome={data.monthOutcome} />
      <WeekMonBudget
        text={add.week.text}
        income={data.weekIncome}
        outcome={data.weekIncome}
      />
      <WeekMonBudget
        text={add.month.text}
        income={data.monthIncome}
        outcome={data.monthOutcome}
      />
      <div className="btn-expensed row">
        <Link className="btn bg" to="/add">
          <div className="h5">{add.btn}</div>
        </Link>
      </div>
    </div>
  );
};

export default AddExpense;
