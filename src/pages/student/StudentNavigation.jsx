import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuItem, Menu, Sidebar } from "react-pro-sidebar";

import { IoFolder } from "react-icons/io5";
import { RiBook2Fill } from "react-icons/ri";
import { MdAnnouncement } from "react-icons/md";
import { PiGavelFill } from "react-icons/pi";
import { MdInfo } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import { GiHelp } from "react-icons/gi";

import logo from "../../components/images/norms_logo.png";
import "../../styles/General.css";

export default function StudentNavigation() {
  const [collapsed, setCollapsed] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItemFontSize = "16px";
  const iconSize = "24px";

  // State to store the active menu item
  const [activeMenuItem, setActiveMenuItem] = React.useState("");

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);

    if (menuItem === "My Records") {
      navigate('/student-myrecords');
    } else if (menuItem === "Announcements") {
      navigate('/student-announcements'); 
    } else if (menuItem === "Legislations") {
      navigate ('/legislations'); 
    } else if (menuItem === "Handbook") {
      navigate('/handbook');
    } else if (menuItem === "FAQs") { 
      navigate ('/student-faqs'); 
    }  else if (menuItem === "About and Contact") {
      navigate('/aboutcontact'); 
    } else if (menuItem === "Settings") {
      navigate('/student-settings'); 
    }
  };


  // Check current page 
  React.useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath === "/student-myrecords") {
      setActiveMenuItem("My Records");
    } else if (currentPath === "/student-announcements") {
      setActiveMenuItem("Announcements");
    } else if (currentPath === "/legislations") {
      setActiveMenuItem("Legislations");
    } else if (currentPath === "/handbook") {
      setActiveMenuItem("Handbook");
    } else if (currentPath === "/student-faqs") {
      setActiveMenuItem("FAQs");
    } else if (currentPath === "/aboutcontact") {
      setActiveMenuItem("About and Contact");
    } else if (currentPath === "/student-settings") {
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
                    style={{ maxHeight: "calc(100vh - 20px)", overflowY: collapsed ? "hidden" : "auto"}}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", height: "auto", padding: "10px", marginBottom: collapsed ? "0" : "10px" }}>
                      <img src={logo} alt="NORMS Logo" style={{ width: collapsed ? "50px" : "auto", height: collapsed ? "50px" : "auto", maxWidth: collapsed ? "100%" : "100%", transition: "width 0.1s ease-in-out, height 0.1s ease-in-out" }} />
                    </div>

                    <MenuItem
                      icon={<IoFolder style={{ fontSize: iconSize, color: getItemColor("My Records") }} />}
                      onClick={() => handleMenuItemClick("My Records")}
                      active={activeMenuItem === "My Records"}
                    >
                      My Records 
                    </MenuItem>
                    <MenuItem
                      icon={<MdAnnouncement style={{ fontSize: iconSize, color: getItemColor("Announcements") }} />}
                      onClick={() => handleMenuItemClick("Announcements")}
                      active={activeMenuItem === "Announcements"}
                    >
                      Announcements
                    </MenuItem>
                    <MenuItem
                      icon={<PiGavelFill style={{ fontSize: iconSize, color: getItemColor("Legislations") }} />}
                      onClick={() => handleMenuItemClick("Legislations")}
                      active={activeMenuItem === "Legislations"}
                    >
                      Legislations
                    </MenuItem>
                    <MenuItem
                      icon={<RiBook2Fill style={{ fontSize: iconSize, color: getItemColor("Handbook") }} />}
                      onClick={() => handleMenuItemClick("Handbook")}
                      active={activeMenuItem === "Handbook"}
                    >
                      Handbook
                    </MenuItem>
                    <MenuItem
                      icon={<GiHelp style={{ fontSize: iconSize, color: getItemColor("FAQs") }} />} 
                      onClick={() => handleMenuItemClick("FAQs")}
                      active={activeMenuItem === "FAQs"}
                    >
                      FAQs
                    </MenuItem>
                    <MenuItem
                      icon={<MdInfo style={{ fontSize: iconSize, color: getItemColor("About and Contact") }} />}
                      onClick={() => handleMenuItemClick("About and Contact")}
                      active={activeMenuItem === "About and Contact"}
                    >
                      About and Contact
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
