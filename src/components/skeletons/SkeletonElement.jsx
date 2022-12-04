import React from 'react'
import "./skeleton.css"
import { domAnimation, LazyMotion, m, useCycle } from 'framer-motion';


const loaderVariants = {
  animationOne: {
    x: [-20, 20],
    y: [0, -30],
    transition: {
      x: {
        repeat: Infinity,
	      repeatType: 'reverse',
        duration: 4.5,
      },
      y: {
        repeat: Infinity,
	      repeatType: 'reverse',
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  },
  animationTwo: {
    y: [0, -40],
    x: 0,
    transition: {
      y: {
        repeat: Infinity,
	      repeatType: 'reverse',
        duration: 0.25,
        ease: 'easeOut'
      }
    }
  }
};


export default function SkeletonElement( { type, width, height } ) {
  const [animation] = useCycle("animationOne", "animationTwo");

  const classes = `skeleton ${type}`;

  const dimensionStyle = {
    width: width,
    height: height
  };

  return (

    <LazyMotion features={domAnimation} >

      <div className={classes}

      >
        <m.div className='candies'style={dimensionStyle}
          variants={loaderVariants}
          animate={animation}
        >
          <span aria-label='paleta' className='gatito' role="img">🍭</span>
          <span aria-label='dulce' className='gatito' role="img">🍬</span>
          <span aria-label='chocolate' className='gatito' role="img">🍫</span>
        </m.div>
      </div>
    </LazyMotion>
  )
}

