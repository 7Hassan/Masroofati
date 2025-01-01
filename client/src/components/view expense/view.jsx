import { useTranslation } from 'react-i18next';
import './view.scss';



const ViewExpense = () => {
  const { t } = useTranslation();
  const nav = t('nav', { returnObjects: true });

  return <div className="view-expensed"></div>;
};

export default ViewExpense;
