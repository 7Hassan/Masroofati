import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';

export const IncomeIcon = () => {
  return (
    <div className="income-icon row status-icon">
      <img src="/icons/down.png" alt="icon"  className='icon-st'/>
    </div>
  );
};
export const OutcomeIcon = () => {
  return (
    <div className="outcome-icon row status-icon">
      <img src="/icons/up.png" alt="icon" className='icon-st'/>
    </div>
  );
};
