import React, { useMemo, useState } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";
import { Bar } from "@nivo/bar";
import { useGetSalesQuery } from "state/api";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

const Daily = () => {
  const { data } = useGetSalesQuery();
  const theme = useTheme();
  let keys = ["percentage_fully_vaccinated"];
  const commonProperties = {
    width: 1250,
    height: 4000,
    margin: { top: 60, right: 80, bottom: 60, left: 80 },
    data: data,
    indexBy: "id",
    layout: "horizontal",
    keys,
    padding: 0.2,
    labelTextColor: "inherit:darker(1.4)",
    labelSkipWidth: 16,
    labelSkipHeight: 16,
  };
  console.log(data);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="BAR CHART" subtitle="График с процентным соотношение по странам" />
      {data ? (
        <div className="chart">
          <Bar
            tooltip={(data) => (
              <div
                style={{
                  padding: 12,
                  color: "#000",
                  background: "#ffffff",
                }}
              >
                <strong>
                  <span>
                    {data.indexValue} - {data.value}%
                  </span>
                </strong>
                <br />
                <strong>
                  Vaccines: {data.data?.vaccines.join(", ")}
                </strong>
              </div>
            )}
            {...commonProperties}
            colors={{ scheme: "category10" }}
          />
        </div>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default Daily;
