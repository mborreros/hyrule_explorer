import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";

function Home({ defaultValues }) {

// local server state variables
const [myMonsterData, setMyMonsterData] = useState([]);
const [myWeaponsData, setMyWeaponsData] = useState([]);

// fetching monsters and weapons data from local server
useEffect(() => {
  fetch("http://localhost:3000/monsters")
    .then(response => response.json())
    .then(data => {setMyMonsterData(data)})
    .catch(error => console.log('error', error));
},[])
useEffect(() => {
  fetch("http://localhost:3000/weapons")
    .then(response => response.json())
    .then(data => {setMyWeaponsData(data)})
    .catch(error => console.log('error', error));
},[])

// creating table headers based on default values
function tableHead(detail) {
  return <th key={detail}>{detail}</th>;
}

const monsterHeaders = Object.keys(defaultValues.monsters.formValues)
const weaponsHeaders = Object.keys(defaultValues.weapons.formValues)
const monsterHeaderElements = monsterHeaders.map((detail) =>  (tableHead(detail)))
const weaponHeaderElements = weaponsHeaders.map((detail) =>  (tableHead(detail)))

// inserting data in table by from local server
const monsterTableData = myMonsterData.map((monster) => {
  return (
    <tr key={monster.id}>
      <td>{monster.name}</td>
      <td>{monster.defeated ? "Yes" : "No"}</td>
      <td>{monster.difficulty}</td>
      <td>{monster.weapon}</td>
      <td>{monster.notes}</td>
    </tr>
  )
})

const weaponTableData = myWeaponsData.map((weapon) => {
  return (
    <tr key={weapon.id}>
      <td>{weapon.name}</td>
      <td>{weapon.favorite ? "Yes" : "No"}</td>
      <td>{weapon.owned ? "Yes" : "No"}</td>
      <td>{weapon.notes}</td>
    </tr>
)})

return (
<div className="container">
  <div className="home-tables">
    <div className="row mb-5">
      <div className="col-12">
        <h4>Your Monster Experiences</h4>
          <div className="card overflow-scroll">
            <div className="card-body p-0">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    {monsterHeaderElements}
                  </tr>
                </thead>
                <tbody>
                  {monsterTableData}
                </tbody>
              </Table>
            </div>
          </div>
      </div>
    </div>
    <div className="row">
      <div className="col-12">
        <h4>Your Weapon Experiences</h4>
        {/* SECOND table goes here! */}
        <Table bordered hover>
          <thead>
            <tr>
              {weaponHeaderElements}
            </tr>
          </thead>
          <tbody>
            {weaponTableData}
          </tbody>
        </Table>
      </div>
    </div>
  </div>
</div>

)}

export default Home;
