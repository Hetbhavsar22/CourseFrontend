import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaPinterest,
} from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import Image from "next/image";
import axios from "axios";
import LoginModal from "./LoginModal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "../src/pages/authentication/AuthContext"; 

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState(91);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const profileRef = useRef(null);
  const profileImage = "/images/profile-image.png";
  // const { login } = useAuth();
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      const userKey = localStorage.getItem("user_key");
  
      if (token && userKey) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/getUserById`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (response.data.status === 200) {
            localStorage.setItem("user_key", response.data.data.id);
            localStorage.setItem("phone_number", response.data.data.phoneNumber);
            setIsAuthenticated(true);
            if(response.data.data.name){
              setUserName(response.data.data.name);
            }
          } else {
            console.log("signing out");
            signout();
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        setIsAuthenticated(false);
      }
    };
  
    fetchUserDetails();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setPhone("")
    setShowLoginModal(false);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOutsideClick = (e) => {
    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setDropdownVisible(false);
    }
  };

  const signout = () => {
    console.log("entered");
      localStorage.removeItem("token");
      localStorage.removeItem("user_key");
      localStorage.removeItem("phone_number");
      setIsAuthenticated(false);
      toggleDropdown();
      window.location.reload(); 
      
  };

  const handleLoginSuccess = (token, userKey) => {
    console.log("first")
    setIsAuthenticated(true);
    localStorage.setItem("token", token);
    localStorage.setItem("user_key", userKey);
    localStorage.setItem("phone_number", phone);
    // login(token, userKey, phone);
    setShowLoginModal(false);
    setDropdownVisible(true);
    window.location.reload(); 
  };

  return (
    <>
      <header className="header-section bg-ash">
        <div
          className="top-bar-header"
          style={{
            color: "#fff",
            padding: "8px 24px",
            backgroundColor: "#333",
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg">
                <div className="ttext-lg-center">
                  <a href="tel:+919727006001">
                    <FaPhone />
                    &nbsp;<span className="p-1">+91-9727006001 </span>
                  </a>
                  &nbsp;|&nbsp;
                  <a href="mailto:garbhsanskarguru@gmail.com">
                    {" "}
                    <FaEnvelope />
                    &nbsp;
                    <span className="p-1">garbhsanskarguru@gmail.com</span>
                  </a>
                </div>
              </div>
              <div className="col-lg-auto d-flex align-items-center ">
                <div className="ttext-lg-center">
                  <a
                    href="https://community.garbhsanskarguru.com/"
                    target="_blank"
                    className="social-icon"
                    style={{ fontSize: "25px" }}
                  >
                    <MdGroups />
                  </a>
                  <a
                    href="https://www.facebook.com/MAJESTICGARBHSANSKAR"
                    target="_blank"
                    className="social-icon"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href="https://www.instagram.com/garbhsanskarguru/"
                    target="_blank"
                    className="social-icon"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCrQ2-hzImdJ4A3BD0yIYm-A?sub_confirmation=1"
                    target="_blank"
                    className="social-icon"
                  >
                    <FaYoutube />
                  </a>
                  <a
                    href="https://in.pinterest.com/mgarbhsanskar"
                    target="_blank"
                    className="social-icon"
                  >
                    <FaPinterest />
                  </a>
                  <a href="https://garbhsanskarguru.quora.com" target="_blank">
                    <img
                      src="https://www.garbhsanskarguru.com/assets/image/logo/icons8-quora.svg"
                      alt="logo"
                      className="social-icon"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header-area">
          <nav className="navbar navbar-expand-lg p-0">
            <div className="container">
              <div className="logo">
                <Link href="/">
                  <img src="/images/Logo_MGPS.png" alt="logo" />
                </Link>
              </div>

              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarTogglerDemo02"
                aria-controls="navbarTogglerDemo02"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarTogglerDemo02"
              >
                <ul className="lab-ul navbar-nav ms-auto mt-3 mb-lg-0">
                  <li className="nav-item mx-2">
                    <Link href="https://www.garbhsanskarguru.com/about-us">
                      About us
                    </Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link href="https://www.garbhsanskarguru.com/blog">
                      Blog
                    </Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link href="/courses">Courses</Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link href="https://www.garbhsanskarguru.com/events">
                      Events
                    </Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link href="https://www.garbhsanskarguru.com/franchise">
                      Franchise
                    </Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link href="https://www.garbhsanskarguru.com/faq">FAQ</Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link href="https://www.garbhsanskarguru.com/contact-us">
                      Contact Us
                    </Link>
                  </li>
                  <li className="nav-item mx-2">
                    {isAuthenticated ? (
                      <>
                        <IconButton onClick={handleMenuOpen} style={{marginTop: "-5px"}}>
                          <Avatar alt="Profile Image" src={profileImage}/>
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={handleMenuClose}>
                            <Link href="/transactions">My Transactions</Link>
                          </MenuItem>
                          <MenuItem onClick={signout}>Sign Out</MenuItem>
                        </Menu>
                      </>
                    ) : (
                      <a>
                        <button
                          className="login-button"
                          onClick={() => setShowLoginModal(true)}
                          style={{marginTop: "-10px"}}
                        >
                          Login
                        </button>
                      </a>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </header>
      {showLoginModal && (
        <LoginModal
          phone={phone}
          setPhone={setPhone}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          onClose={() => handleClose()}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default Navbar;
