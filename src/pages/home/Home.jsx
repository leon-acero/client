import "./home.css";

import { useNavigatorOnLine } from '../../hooks/useNavigatorOnLine';
import OfflineFallback from '../../components/offlineFallback/OfflineFallback';


import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import ReportMonthlySalesByYear from '../reports/reportMonthlySalesByYear/ReportMonthlySalesByYear';

import { useMatchMedia } from "../../hooks/useMatchMedia";
import SplashScreen from '../../components/splashScreen/SplashScreen';


export default function Home() {
  
  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
  /*****************************************************************************/

  /*************************     useMatchMedia    ******************************/
  // Se usa para saber si estoy usando una Laptop, Tablet o Celular
  const isDesktopResolution = useMatchMedia("(min-width:53.75em)", true);
  /*****************************************************************************/


  return (
    <>
      {
        isOnline && (
          <div className="home">
            {
            isDesktopResolution && (
              <>
                <FeaturedInfo />
                <ReportMonthlySalesByYear />
              </>
              )
            }
            {
            !isDesktopResolution && (
              <>
                <SplashScreen />
              </>
              )
            }
          </div>
        )
      }
      {
        !isOnline && <OfflineFallback />
      }
    </>

  );
}
