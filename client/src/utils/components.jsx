
import { LoadingColor, loading, loadingRed } from '../assets/images';




export const Loading = ({ type }) => {
  return <>
    {type === "white" && <img src={loading} alt="loading" className="loading" />}
    {type === "color" && <img src={LoadingColor} alt="loading" className="loading" />}
    {type === "red" && <img src={loadingRed} alt="loading" className="loading" />}
  </>
}


