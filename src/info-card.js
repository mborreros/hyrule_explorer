import React from "react";

function InfoCard({ itemName, description, image, drops, locations, defense, attack, type, itemLoaded, capitalizeString }) {

// deconstructing arrays once a monster is selected, returns a blank string if not monster selected to allow page to load successfully
const dropsString = drops ? capitalizeString(drops.join(", ")) : "";
const locationsString = locations ? locations.join(", ") : "";

// shows item information depending on if weapon or monster
let applicableData;
if (type === "monsters") {
  applicableData = <p className="card-text detail"><strong>Drops:</strong> {dropsString} </p>
} else if (type === "weapons") {
  applicableData = 
    <>
      <p className={`card-text detail ${attack == null  ? "d-none" : ""}`}>Attack: {attack}</p>
      <p className={`card-text detail ${defense == null ? "d-none" : ""}`}>Defense: {defense}</p>
    </>
  }

  return(
  <div className="col-6 info">
    <div className={`card mb-3 shadow-sm ${!itemLoaded ? "loading" : ""}`} style={{maxWidth: 540}}>
        <div className="card-header entry-name">{!itemLoaded ? "Loading..." : itemName}</div>
        <div className="card-body ">
        <div className="row g-0">
          <div className="col-md-4 img-side pe-3">
            <img src={image} className="img-fluid rounded-start detail" alt={itemName} />
          </div>
          <div className="col-md-8 text-side ">
            <div>
              {applicableData}
              <p className="card-text detail"><strong>Common Locations:</strong> {locationsString} </p>
              <hr className="detail"/>
              <p className="card-text detail description ">{description}</p>
            </div>
          </div>
      </div>
      </div>
    </div>
  </div>

  )
}

export default InfoCard;