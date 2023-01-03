import "./home.css";

/*************************    Offline/Online     ****************************/
import { useNavigatorOnLine } from '../../hooks/useNavigatorOnLine';
import OfflineFallback from '../../components/offlineFallback/OfflineFallback';
/****************************************************************************/

/***************************   Components     *******************************/
import SplashScreen from '../../components/splashScreen/SplashScreen';
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
/****************************************************************************/

/*****************************   Pages     **********************************/
import ReportMonthlySalesByYear from '../reports/reportMonthlySalesByYear/ReportMonthlySalesByYear';
/****************************************************************************/

/***************************   Custom Hooks     *****************************/
import { useMatchMedia } from "../../hooks/useMatchMedia";
/****************************************************************************/


/**************************    Framer-Motion    *****************************/
import { domAnimation, LazyMotion, m } from 'framer-motion';

const svgVariants = {
  hidden: { 
    opacity: 0, 
  },
  visible: { 
    opacity: 1, 
    transition: { delay: .5, duration: 2 }
  }
};
/****************************************************************************/


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
          <LazyMotion features={domAnimation} >
            <m.div  className="home"
                    variants={svgVariants}
                    initial="hidden"
                    animate="visible"
            >
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
            </m.div>
          </LazyMotion>
        )
      }
      {
        !isOnline && <OfflineFallback />
      }
    </>

  );
}
