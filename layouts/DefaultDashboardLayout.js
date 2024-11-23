// import node module libraries
import { useState } from "react";
import { useRouter } from "next/router";

// import sub components
import NavbarVertical from "../layouts/navbars/NavbarVertical";
import NavbarTop from "../layouts/navbars/NavbarTop";
import { Row, Col } from "react-bootstrap";

const DefaultDashboardLayout = (props) => {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith("/admin");
  const [showMenu, setShowMenu] = useState(true);
  const ToggleMenu = () => {
    return setShowMenu(!showMenu);
  };
  return (
    <div id="db-wrapper" className={`${showMenu ? "" : "toggled"}`}>
      {isAdmin && (
        <div className="navbar-vertical navbar">
          <NavbarVertical
            showMenu={showMenu}
            onClick={() => setShowMenu(!showMenu)}
          />
        </div>
      )}
      <div id="page-content">
        {isAdmin && (
          <div className="header">
            <NavbarTop
              data={{
                showMenu: showMenu,
                SidebarToggleMenu: ToggleMenu,
              }}
            />
          </div>
        )}
        {props.children}
      </div>
    </div>
  );
};
export default DefaultDashboardLayout;
