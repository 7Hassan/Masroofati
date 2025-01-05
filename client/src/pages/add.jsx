import { useTranslation } from 'react-i18next';
import './add.scss';
import { Link } from 'react-router-dom'; // Ensure correct import
import ExpenseForm from '../components/addForm/add';

const Head = () => {
  const { t } = useTranslation();
  const head = t('add.head', { returnObjects: true });

  return (
    <div className="header">
      <Link to={head.img.url}>
        <div className="img">
          <img src={head.img.link} alt={head.img.alt} />
        </div>
      </Link>
      <h4 className="welcome">{head.dis.head}</h4>
      <h5 className="text-light">{head.dis.dis}</h5>
    </div>
  );
};


const Add = () => (
  <div className="add">
    <Head />
    <ExpenseForm />
  </div>
);

export default Add;
