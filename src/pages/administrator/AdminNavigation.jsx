import React from "react";
import { MenuItem, Menu, Sidebar } from "react-pro-sidebar";
import { useNavigate, useLocation } from "react-router-dom";

import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { RiFolderUserFill } from "react-icons/ri";

import "../../styles/General.css";
import logo from "../../components/images/norms_logo.png";

export default function AdminNavigation() {
  const [collapsed, setCollapsed] = React.useState(true); 
  const navigate = useNavigate();
  const location = useLocation();

  const menuItemFontSize = "16px";
  const iconSize = "24px";

  // State to store the active menu item
  const [activeMenuItem, setActiveMenuItem] = React.useState("Dashboard");

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  
    if (menuItem === "Dashboard") {
      navigate('/admin-dashboard');
    } else if (menuItem === "User Management") {
      navigate('/admin-usermanagement');
    } else if (menuItem === "User Logs") {
      navigate('/admin-userlogs');
    } else if (menuItem === "Settings") {
      navigate('/admin-settings');
    }
  };
  
  
  // Check current page 
  React.useEffect(() => {
    const currentPath = location.pathname;
  
    if (currentPath === "/admin-dashboard") {
      setActiveMenuItem("Dashboard");
    } else if (currentPath === "/admin-usermanagement") {
      setActiveMenuItem("User Management");
    } else if (currentPath === "/admin-userlogs") {
      setActiveMenuItem("User Logs");
    } else if (currentPath === "/admin-settings") {
      setActiveMenuItem("Settings");
    }
  }, [location.pathname]);
  
  
  const getItemColor = (menuItem) => {
    return activeMenuItem.trim() === menuItem.trim() ? "#134E0F" : "#b1b1b1";
  };
  

return (
  <>
      <div className="w-full bg-white-A700">
        <div className="self-end">
          <div className="flex md:flex-col items-start">
            <div className="sidebar-container"> 
              <div
                className="rounded-lg shadow" 
                style={{
                  backgroundColor: "#FFFFFF", 
                  transition: "width 0.3s ease-in-out", 
                  position: "fixed",
                  left: 0,
                  top: 0,
                  zIndex: 1000,
                  padding: collapsed ? "0" : "10px", 
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
                        [`&:hover, &.ps-active`]: {
                          color: "#134E0F", 
                          "& svg": {
                            fill: "#134E0F",
                          },
                        },
                      },
                      menuItemActive: {
                        color: "#134E0F", 
                        "& svg": {
                          fill: "#134E0F",
                        },
                      },
                    }}
                    rootStyles={{
                      ["&>ul"]: {
                        gap: "4px",
                        paddingTop: collapsed ? "13px" : "0",
                      },
                    }}
                    className="flex flex-col items-center w-full"
                    style={{ maxHeight: "calc(100vh - 20px)", overflowY: collapsed ? "hidden" : "auto"}} // Hide overflowY when collapsed
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", height: "auto", padding: "10px", marginBottom: collapsed ? "0" : "10px" }}>
                      <img 
                        src={logo} 
                        alt="NORMS Logo" 
                        onClick={() => handleMenuItemClick("Dashboard")} 
                        style={{ width: collapsed ? "50px" : "auto", height: collapsed ? "50px" : "auto", maxWidth: collapsed ? "100%" : "100%", transition: "width 0.1s ease-in-out, height 0.1s ease-in-out" }} 
                      />
                    </div>

                    <MenuItem
                      icon={<MdSpaceDashboard style={{ fontSize: iconSize, color: getItemColor("Dashboard") }} />}
                      onClick={() => handleMenuItemClick("Dashboard")}
                      active={activeMenuItem === "Dashboard"}
                    >
                      Dashboard
                    </MenuItem>
                    <MenuItem
                      icon={<FaUsers style={{ fontSize: iconSize, color: getItemColor("User Management") }} />}
                      onClick={() => handleMenuItemClick("User Management")}
                      active={activeMenuItem === "User Management"}
                    >
                      User Management
                    </MenuItem>
                    <MenuItem
                      icon={<RiFolderUserFill style={{ fontSize: iconSize, color: getItemColor("User Logs") }} />}
                      onClick={() => handleMenuItemClick("User Logs")}
                      active={activeMenuItem === "User Logs"}
                    >
                      User Logs
                    </MenuItem>
                    <MenuItem
                      icon={<FaGear style={{ fontSize: iconSize, color: getItemColor("Settings") }} />}
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
