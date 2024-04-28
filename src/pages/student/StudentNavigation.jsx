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
import { useNavigate } from "react-router-dom";

import logo from "../../assets/images/norms_logo.png";

export default function StudentNavigation() {
  const [collapsed, setCollapsed] = React.useState(true); // Default state is collapsed
  const [searchBarValue2, setSearchBarValue2] = React.useState("");
  const navigate = useNavigate();

  // Define font size and icon size variables
  const menuItemFontSize = "16px";
  const iconSize = "24px";

  // State to store the active menu item
  const [activeMenuItem, setActiveMenuItem] = React.useState("Dashboard");

  // Function to handle menu item click
  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
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
                  zIndex: 1000,
                  padding: collapsed ? "0" : "10px", // Add padding when expanded
                }}
              >
                <Sidebar
                  width={collapsed ? "70px !important" : "252px !important"}
                  collapsedWidth="70px !important"
                  collapsed={collapsed}
                  onClick={() => {
                    setCollapsed(!collapsed);
                  }}
                  className="flex flex-col h-screen top-0 py-[13px] !sticky overflow-auto"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1000,
                  }}
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
                    style={{ maxHeight: "calc(100vh - 100px)", overflowY: collapsed ? "hidden" : "auto" }} // Hide overflowY when collapsed
                  >

                 <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", height: "auto", padding: "10px", marginBottom: collapsed ? "0" : "10px" }}>
                    <img src={logo} alt="NORMS Logo" style={{ width: collapsed ? "50px" : "auto", height: collapsed ? "50px" : "auto", maxWidth: collapsed ? "100%" : "100%", transition: "width 0.1s ease-in-out, height 0.1s ease-in-out" }} />
                  </div>

                    <MenuItem
                      icon={<MdSpaceDashboard style={{ fontSize: iconSize }} />}
                      onClick={() => handleMenuItemClick("Dashboard")} // Set the active menu item on click
                      active={activeMenuItem === "Dashboard"} // Set the active state based on the active menu item
                    >
                      Dashboard
                    </MenuItem>
                    <MenuItem
                      icon={<FaUsers style={{ fontSize: iconSize }} />}
                      onClick={() => handleMenuItemClick("User Management")} // Set the active menu item on click
                      active={activeMenuItem === "User Management"} // Set the active state based on the active menu item
                    >
                      User Management
                    </MenuItem>
                    <MenuItem
                      icon={<IoFileTrayFull style={{ fontSize: iconSize }} />}
                      onClick={() => handleMenuItemClick("Record Management")} // Set the active menu item on click
                      active={activeMenuItem === "Record Management"} // Set the active state based on the active menu item
                    >
                      Record Management
                    </MenuItem>
                    <MenuItem
                      icon={<IoDocuments style={{ fontSize: iconSize }} />}
                      onClick={() => handleMenuItemClick("Report Management")} // Set the active menu item on click
                      active={activeMenuItem === "Report Management"} // Set the active state based on the active menu item
                    >
                      Report Management
                    </MenuItem>
                    <MenuItem
                      icon={<FaUserClock style={{ fontSize: iconSize }} />}
                      onClick={() => handleMenuItemClick("Login History")} // Set the active menu item on click
                      active={activeMenuItem === "Login History"} // Set the active state based on the active menu item
                    >
                      Login History
                    </MenuItem>
                    <MenuItem
                      icon={
                        <RiFileHistoryFill style={{ fontSize: iconSize }} />
                      }
                      onClick={() => handleMenuItemClick("User History")} // Set the active menu item on click
                      active={activeMenuItem === "User History"} // Set the active state based on the active menu item
                    >
                      User History
                    </MenuItem>
                    <MenuItem
                      icon={<FaUserShield style={{ fontSize: iconSize }} />}
                      onClick={() => handleMenuItemClick("Admin Audit Log")} // Set the active menu item on click
                      active={activeMenuItem === "Admin Audit Log"} // Set the active state based on the active menu item
                    >
                      Admin Audit Log
                    </MenuItem>
                    <MenuItem
                      icon={<FaGear style={{ fontSize: iconSize }} />}
                      onClick={() => handleMenuItemClick("Settings")} // Set the active menu item on click
                      active={activeMenuItem === "Settings"} // Set the active state based on the active menu item
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