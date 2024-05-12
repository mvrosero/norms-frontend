import React from "react";
import { MenuItem, Menu, Sidebar } from "react-pro-sidebar";
import "../general/General.css";

import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";

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
    navigate(`/admin-${menuItem.toLowerCase().replace(' ', '')}`);
  };

  React.useEffect(() => {
    // Extract the page name from the URL path
    const pageName = location.pathname.split("/").pop().replace('admin-', '').replace('-', ' ');
    setActiveMenuItem(pageName);
  }, [location.pathname]);

  // Function to get the color for the menu item based on its activity
  const getItemColor = (menuItem) => {
    return activeMenuItem === menuItem ? "#134E0F" : "#b1b1b1";
  };

  // Function to get the icon color for the collapsed sidebar
  const getCollapsedIconColor = (menuItem) => {
    return activeMenuItem === menuItem ? "#134E0F" : "initial";
  };

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
                        [`&:hover, &.ps-active`]: {
                          color: "#134E0F", // Change text color on hover
                          "& svg": {
                            // Change icon color on hover
                            fill: "#134E0F",
                          },
                        },
                      },
                      menuItemActive: {
                        color: "#134E0F", // Set the active color to green
                        "& svg": {
                          // Set active icon color
                          fill: "#134E0F",
                        },
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
