import React from "react";

function BlankInfoCard({ message }) {

  return(
  <div className="col-6 info">
    <div className="card mb-3 shadow-sm d-flex justify-content-center" style={{maxWidth: 540}}>
            <h5 className="card-title text-center">... Please select a {message} ...</h5>
        </div>
      </div>
  )
}

export default BlankInfoCard;