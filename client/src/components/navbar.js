
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Navbar as BootstrapNavbar, Nav, Button, Container } from "react-bootstrap";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/auth");
  };

  return (
    <BootstrapNavbar expand="lg" className="navbar navbar-dark bg-dark px-4">
      <Container className="d-flex justify-content-between align-items-center w-100">
        
        {/* Left side - Login/Logout */}
        <Nav className="auth-buttons">
  {!cookies.access_token ? (
    <Link to="/auth" className="btn btn-outline-light">Login/Register</Link>
  ) : (
    <Button onClick={logout} className="btn btn-danger">Logout</Button>
  )}
</Nav>


        {/* Center - FOODGRAM & Navigation Links */}
        <div className="d-flex align-items-center gap-8">
          <Link to="/" className="navbar-brand text-light fs-3 fw-bold">FOODGRAM</Link>
          <Nav className="d-flex gap-8"> {/* gap-4 adds spacing */}
            <Link className="nav-link text-light fs-7" to="/">Home</Link>
            <Link className="nav-link text-light fs-7" to="/create-recipe">Create Recipe</Link>
            <Link className="nav-link text-light fs-7" to="/saved-recipes">Saved Recipes</Link>
          </Nav>
        </div>

      </Container>
    </BootstrapNavbar>
  );
};



                                                       

                                                  



