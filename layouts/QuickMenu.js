// import node module libraries
import Link from "next/link";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Row, Col, Image, Dropdown, ListGroup } from "react-bootstrap";
import "simplebar/dist/simplebar.min.css";
import useMounted from "../hooks/useMounted";

const QuickMenu = () => {
  const hasMounted = useMounted();

  const isDesktop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  const QuickMenuDesktop = () => {
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
      const fetchAdminData = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No token found. Please login again.");
          }

          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/get_details`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setAdmin(response.data.data);
        } catch (error) {
          console.error("Error fetching admin data:", error);
        }
      };

      fetchAdminData();
    }, []);

    const handleLogout = () => {
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/logout`,{
        headers:{
          authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      localStorage.removeItem("token");
      window.location.href = "/admin";
    };
    return (
      <ListGroup
        as="ul"
        bsPrefix="navbar-nav"
        className="navbar-right-wrap ms-auto d-flex nav-top-wrap"
      >
        <Dropdown as="li" className="ms-2">
          <Dropdown.Toggle
            as="a"
            bsPrefix=" "
            id="dropdownAdmin"
            className="btn btn-light btn-icon rounded-circle indicator indicator-primary text-muted"
          >
            {admin && (
              <label htmlFor="file-upload">
                <Image
                  src={
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/public${admin.profile_image}` ||
                    "/images/avatar/avatar-1.jpg"
                  }
                  className="rounded-circle avatar avatar-sm"
                  alt={admin.name}
                  style={{ cursor: "pointer" }}
                />
              </label>
            )}
          </Dropdown.Toggle>

          <Dropdown.Menu
            className="dropdown-menu dropdown-menu-end"
            align="end"
            aria-labelledby="dropdownAdmin"
          >
            <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=" ">
              {admin && (
                <div className="lh-1">
                  <h5 className="mb-1"> {admin.name} </h5>
                </div>
              )}
              <div className=" dropdown-divider mt-3 mb-2"></div>
            </Dropdown.Item>
            <Dropdown.Item eventKey="2">
              <i className="fe fe-user me-2"></i>
              <Link href="/admin/profile">Edit Profile</Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <i className="fe fe-settings me-2"></i>
              <Link href="/admin/settings">Change Password</Link>
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>
              <i className="fe fe-power me-2"></i> Sign Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup>
    );
  };

  return <Fragment>{hasMounted && <QuickMenuDesktop />}</Fragment>;
};

export default QuickMenu;
