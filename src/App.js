import React from "react";
import { Routes, Route } from "react-router-dom";

import NavBar from "./navbar";
import Home from "./home";
import BasePage from "./base-page";

import "bootstrap/dist/css/bootstrap.min.css";
import ".//index.css"

function App() {

// default values for item type
const defaultValues = {
  monsters: {
    typeName: "monster",
    formValues: {
      name: "",
      defeated: false,
      difficulty: "",
      weapon: "",
      notes: ""
    }
  },
  weapons: {
    typeName: "weapon",
    formValues: {
      name: "",
      favorite: false,
      owned: false,
      notes: ""
    }
  },
}

  return (
    <div className="hyrule">
      <NavBar/>
        <Routes>
          <Route exact path="/" element={<Home defaultValues={defaultValues}/>} /> 
          <Route path="/monsters" element={<BasePage pageTitle={"Monster"} defaultValues={defaultValues}/>} />
          <Route path="/weapons" element={<BasePage pageTitle={"Weapon"} defaultValues={defaultValues}/>} />
        </Routes>
      </div>
  )}

export default App;
