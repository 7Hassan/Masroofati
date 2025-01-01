import { useTranslation } from 'react-i18next';
import { IncomeIcon, OutcomeIcon } from '../eles';
import { Link } from 'react-router-dom';
import './add.scss';

const MonthBudget = () => {
  return (
    <div className="month-budget row">
      <div className="income budget-box">
        <div className="text row">
          <img src="/icons/down.png" alt="icon" className="icon-st" />
          <div className="h5">الدخل</div>
        </div>
        <div className="money h3">300 EG</div>
      </div>
      <div className="outcome  budget-box">
        <div className="text row">
          <img src="/icons/up.png" alt="icon" className="icon-st" />
          <div className="h5">المصاريف</div>
        </div>
        <div className="money h3">300 EG</div>
      </div>
    </div>
  );
};
const WeekBudget = ({ text, income, outcome }) => {
  return (
    <div className="week-day-budget">
      <div className="name h5">{text}</div>
      <div className="row">
        <div className="text row">
          <OutcomeIcon />
          <div className="h3">{outcome} EG</div>
        </div>
        <div className="text row">
          <IncomeIcon />
          <div className="h3">{income} EG</div>
        </div>
      </div>
    </div>
  );
};

const AddExpense = () => {
  const { t } = useTranslation();
  const nav = t('nav', { returnObjects: true });

  return (
    <div className="add-expensed">
      <MonthBudget />
      <WeekBudget text="اليوم" income={300} outcome={100} />
      <WeekBudget text="الاسبوع" income={300} outcome={100} />
      <div className="btn-expensed row">
        <Link className="btn bg" to="/add">
          <div className="h5">اضافة مصروف</div>
        </Link>
      </div>
    </div>
  );
};

export default AddExpense;
