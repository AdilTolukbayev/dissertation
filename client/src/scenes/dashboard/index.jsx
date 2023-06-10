import React from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import { DownloadOutlined } from "@mui/icons-material";
import { Box, Button, useTheme, useMediaQuery } from "@mui/material";
import Daily from "scenes/daily";
import Geography from "scenes/geography";
import "../../styles/dashboard.css";
import Transactions from "scenes/transactions";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  return (
    <div className="dashboard">
      <div className="dashboard__wrapper">
        <div className="statics">
          <div className="stats">
            {/* <h3 className="stats__title">Miles Statistics</h3> */}
            <Geography />
          </div>

          <div className="stats">
            {/* <h3 className="stats__title">Car Statistics</h3> */}
            <Daily />
          </div>
          <div className="stats">
            {/* <h3 className="stats__title">Car Statistics</h3> */}
            <Transactions />
          </div>
        </div>

        {/* <div className="recommend__cars-wrapper">
          {recommendCarsData.map((item) => (
            <RecommendCarCard item={item} key={item.id} />
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
