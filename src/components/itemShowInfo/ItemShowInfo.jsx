import "./itemShowInfo.css"
import {clsx} from "clsx";


function ItemShowInfo({ 
  CustomIcon, 
  labelData, 
  itemData, 
  alinearSpaceBetween = true }) {


  return (
    <div className="itemShowInfo">
      <CustomIcon className="itemShowIcon" />

      <div className={clsx (
                    { 
                      itemShowInfoTitle__alinearSpaceBetween: alinearSpaceBetween, 
                      itemShowInfoTitle__container: true,
                    })}>
        <span className="itemShowInfoTitle__label">{labelData}</span>
        <span className="itemShowInfoTitle__data">{itemData}</span>
      </div>
    </div>
  )
}

export default ItemShowInfo