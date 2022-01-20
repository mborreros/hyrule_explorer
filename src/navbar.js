import React from "react";
import { NavLink } from "react-router-dom"
import logo from "./img/logo.png";

function NavBar() {

    return (
     <header className="d-flex flex-wrap justify-content-center align-items-center py-3 mb-4 border-bottom">
        {/* need to update code to link to home page as a client side route rather than href */}
        <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
        <img className="bi me-2 logo" src={logo} alt="hetsu"/>
        <span className="fs-4">Hyrule Explorer</span>
  </a>
  <ul className="nav nav-pills pe-3">
    <li className="nav-item"><NavLink to="/monsters" className="nav-link">Monsters</NavLink></li>
    <li className="nav-item"><NavLink to="/weapons" className="nav-link">Weapons</NavLink></li>
  </ul>
</header>

    );
}

export default NavBar;