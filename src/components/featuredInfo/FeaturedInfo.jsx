import "./featuredInfo.css";

/*****************************    React Icons     ***************************/
import {FaArrowUp, FaArrowDown} from "react-icons/fa";
/****************************************************************************/

/*******************************    Format     ******************************/
// import { NumericFormat } from 'react-number-format';
import { formateaCurrency } from '../../utils/formatea';
/****************************************************************************/


export default function FeaturedInfo() {
  return (
    <div className="featured">

      <div className="featuredItem">
        <span className="featuredTitle">Ganancias</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{formateaCurrency(3000)}</span>
          <span className="featuredMoneyRate">
            -11.4 <FaArrowDown  className="featuredIcon negative"/>
          </span>
        </div>
        <span className="featuredSub">Comparados con el mes anterior</span>
      </div>

      <div className="featuredItem">
        <span className="featuredTitle">Ventas</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{formateaCurrency(4415)}</span>
          <span className="featuredMoneyRate">
            -1.4 <FaArrowDown className="featuredIcon negative"/>
          </span>
        </div>
        <span className="featuredSub">Comparados con el mes anterior</span>
      </div>
      
      <div className="featuredItem">
        <span className="featuredTitle">Compras</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{formateaCurrency(2225)}</span>
          <span className="featuredMoneyRate">
            +2.4 <FaArrowUp className="featuredIcon"/>
          </span>
        </div>
        <span className="featuredSub">Comparados con el mes anterior</span>
      </div>
      
    </div>
  );
}
