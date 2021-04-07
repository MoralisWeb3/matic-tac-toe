import React from "react";
import { ProfileIcon } from "./Profile";
import { AuthButton } from "./Auth";
import { NavLink } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar bg-light">
      <div className="container-fluid">
        <div className="me-2 mb-1">
          <ProfileIcon />
        </div>
        <div className="flex-grow-1" />
        <div className="row g-3 align-items-center">  
          <div className="col-auto">
            <NavLink className="btn mx-1" activeClassName="btn-outline-dark" to="/" exact>Home</NavLink>
            <NavLink className="btn mx-1" activeClassName="btn-outline-dark" to="/tic-tac-toe" exact>New Game</NavLink>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
