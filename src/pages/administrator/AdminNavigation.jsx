import React from "react";
import { MenuItem, Menu, Sidebar } from "react-pro-sidebar";
import "../general/General.css";

import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoDocuments } from "react-icons/io5";
import { IoFileTrayFull } from "react-icons/io5";
import { FaUserClock } from "react-icons/fa";
import { RiFileHistoryFill } from "react-icons/ri";
import { FaUserShield } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";

import { Helmet } from "react-helmet";
import { CloseSVG } from "../../assets/images/close";
import { Text, Img, Heading, Input, Button } from "../../components";

import { AiOutlineAudit } from "react-icons/ai";
import { BiSolidCommentDots } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

import logo from "../../assets/images/norms_logo.png";

export default function AdminNavigation() {
  const [collapsed, setCollapsed] = React.useState(true); // Default state is collapsed
  const [searchBarValue2, setSearchBarValue2] = React.useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Define font size and icon size variables
  const menuItemFontSize = "16px";
  const iconSize = "24px";

  // State to store the active menu item
  const [activeMenuItem, setActiveMenuItem] = React.useState(null);

  // Function to handle menu item click
  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    switch (menuItem) { 
      case "Dashboard": navigate('/admin-dashboard');
      break;

      case "User Management": navigate('/admin-usermanagement');
      break;

      case "Record Management": navigate('/admin-recordmanagement');
      break;

      case "Report Management": navigate('/admin-reportmanagement');
      break;

      case "Login History": navigate('/admin-loginhistory');
      break;

      case "User History": navigate('/admin-userhistory');
      break;

      case "Admin Audit Trail": navigate('/admin-audittrail');
      break;

      case "Settings": navigate('/admin-settings');
      break;
    }
  };

  React.useEffect(() => {
    // Extract the page name from the URL path
    const pageName = location.pathname.split("/").pop();
    setActiveMenuItem(pageName);
  }, [location.pathname]);

  return (
    <>
      <div className="w-full bg-white-A700">
        <div className="self-end">
          <div className="flex md:flex-col items-start">
            <div className="sidebar-container"> {/* Container with drop shadow */}
              <div
                className="rounded-lg shadow" // Apply rounded corners and lighter drop shadow
                style={{
                  backgroundColor: "#FFFFFF", // White background color
                  transition: "width 0.3s ease-in-out", // Ensure smooth transition of sidebar width
                  position: "fixed",
                  left: 0,
                  top: 0,
                  zIndex: 1000,
                  padding: collapsed ? "0" : "10px", // Add padding when expanded
                }}
              >
                <Sidebar
                  collapsedWidth="70px !important"
                  collapsed={collapsed}
                  onClick={() => {
                    setCollapsed(!collapsed);
                  }}
                  className="flex flex-col h-screen top-0 py-[13px] !sticky overflow-auto"
                >
                  
                  <Menu
                    menuItemStyles={{
                      button: {
                        padding: "17px 12px",
                        gap: "26px",
                        alignSelf: "end",
                        color: "#b1b1b1",
                        fontWeight: 500,
                        fontSize: menuItemFontSize,
                        [`&:hover, &.ps-active`]: { color: "#042b1b" },
                      },
                      menuItemActive: {
                        color: "green", // Set the active color to green
                      },
                    }}
                    rootStyles={{
                      ["&>ul"]: {
                        gap: "4px",
                        paddingTop: collapsed ? "13px" : "0", // Adjust paddingTop dynamically
                      },
                    }}
                    className="flex flex-col items-center w-full"
                    style={{ maxHeight: "calc(100vh - 20px)", overflowY: collapsed ? "hidden" : "auto"}} // Hide overflowY when collapsed
                  >

                 <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", height: "auto", padding: "10px", marginBottom: collapsed ? "0" : "10px" }}>
                    <img src={logo} alt="NORMS Logo" style={{ width: collapsed ? "50px" : "auto", height: collapsed ? "50px" : "auto", maxWidth: collapsed ? "100%" : "100%", transition: "width 0.1s ease-in-out, height 0.1s ease-in-out" }} />
                  </div>

                    <MenuItem
                      icon={<MdSpaceDashboard style={{ fontSize: iconSize, color: activeMenuItem === "Dashboard" ? "green" : "#b1b1b1" }} />}
                      onClick={() => handleMenuItemClick("Dashboard")}
                      active={activeMenuItem === "Dashboard"}
                    >
                      Dashboard
                    </MenuItem>
                    <MenuItem
                      icon={<FaUsers style={{ fontSize: iconSize, color: activeMenuItem === "User Management" ? "green" : "#b1b1b1" }} />}
                      onClick={() => handleMenuItemClick("User Management")}
                      active={activeMenuItem === "User Management"}
                    >
                      User Management
                    </MenuItem>
                    <MenuItem
                      icon={<IoFileTrayFull style={{ fontSize: iconSize, color: activeMenuItem === "Record Management" ? "green" : "#b1b1b1" }} />}
                      onClick={() => handleMenuItemClick("Record Management")}
                      active={activeMenuItem === "Record Management"}
                    >
                      Record Management
                    </MenuItem>
                    <MenuItem
                      icon={<IoDocuments style={{ fontSize: iconSize, color: activeMenuItem === "Report Management" ? "green" : "#b1b1b1" }} />}
                      onClick={() => handleMenuItemClick("Report Management")}
                      active={activeMenuItem === "Report Management"}
                    >
                      Report Management
                    </MenuItem>
                    <MenuItem
                      icon={<FaUserClock style={{ fontSize: iconSize, color: activeMenuItem === "Login History" ? "green" : "#b1b1b1" }} />}
                      onClick={() => handleMenuItemClick("Login History")}
                      active={activeMenuItem === "Login History"}
                    >
                      Login History
                    </MenuItem>
                    <MenuItem
                      icon={<RiFileHistoryFill style={{ fontSize: iconSize, color: activeMenuItem === "User History" ? "green" : "#b1b1b1" }} />}
                      onClick={() => handleMenuItemClick("User History")}
                      active={activeMenuItem === "User History"}
                    >
                      User History
                    </MenuItem>
                    <MenuItem
                      icon={<FaUserShield style={{ fontSize: iconSize, color: activeMenuItem === "Admin Audit Trail" ? "green" : "#b1b1b1" }} />}
                      onClick={() => handleMenuItemClick("Admin Audit Trail")}
                      active={activeMenuItem === "Admin Audit Trail"}
                    >
                      Admin Audit Trail
                    </MenuItem>
                    <MenuItem
                      icon={<FaGear style={{ fontSize: iconSize, color: activeMenuItem === "Settings" ? "green" : "#b1b1b1" }} />}
                      onClick={() => handleMenuItemClick("Settings")}
                      active={activeMenuItem === "Settings"}
                    >
                      Settings
                    </MenuItem>
                  </Menu>
                </Sidebar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
