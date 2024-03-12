import React from "react";
import { useRoutes } from "react-router-dom";
import Home from "pages/Home";
import NotFound from "pages/NotFound";
import MainDashboard from "pages/MainDashboard";
import Transaction from "pages/Transaction";
import Investments from "pages/Investments";
import SettingPageThree from "pages/SettingPageThree";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <Home /> },
    { path: "*", element: <NotFound /> },
    {
      path: "maindashboard",
      element: <MainDashboard />,
    },
    {
      path: "transaction",
      element: <Transaction />,
    },
    {
      path: "investments",
      element: <Investments />,
    },
    {
      path: "settingpagethree",
      element: <SettingPageThree />,
    },
  ]);

  return element;
};

export default ProjectRoutes;
