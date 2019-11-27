import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import './Sidenav.scss';
import logo from '../assets/nisumlogo.png';

class Sidenav extends Component {
  render() {
    return (
      <React.Fragment>
          <div className="logo-section">
              <a href="/"><img  className="img" src={logo} alt="logo" /></a>
          </div>
          <nav className="menu">
              <ul className="menu-list">
                {this.props.links.map((link, index) => (
                  <li key={index}>
                    <NavLink to={`/app/${link.root}`} activeClassName="active">
                        <i className={`${link.class} list-icon`} aria-hidden="true"></i>
                        <span>{link.title}</span>
                    </NavLink>
                  </li>
                ))}
              </ul> 
          </nav>
      </React.Fragment>
    )
  }
}

export default Sidenav;
