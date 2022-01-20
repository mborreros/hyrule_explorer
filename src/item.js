import React from "react";

function Item({ id, itemName, image, onClick }) {
  
  return(
        <div className="col item" id={id} title={itemName} onClick={(id) => onClick(id)}>
          <div className="card shadow-sm">
            <img className="card-img-top" src={image} alt={itemName}/>
            <div className="card-body">
              <p className="card-text item-name entry-name" >{itemName}</p>
            </div>
          </div>
        </div>
  )
}

export default Item;