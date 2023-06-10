import React, { useMemo, useState } from "react";
import { Box, useTheme, MenuItem, Select } from "@mui/material";
import Header from "components/Header";
import { ResponsiveLine } from "@nivo/line";
import { useGetLineQuery } from "state/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Daily = () => {
  const [startDate, setStartDate] = useState(new Date("2021-02-01"));
  const [endDate, setEndDate] = useState(new Date("2021-06-16"));
  const { data } = useGetLineQuery();
  const theme = useTheme();
  const [selectedCountry, setSelectedCountry] = useState("Brazil");
  const [selectedVaccine, setSelectedVaccine] = useState("");
  const [availableCountries, setAvailableCountries] = useState([]);

  const filteredVaccineOptions = useMemo(() => {
    if (!data) return [];

    const filteredData = selectedCountry
      ? Object.values(data.data).filter(
          ({ location }) => location === selectedCountry
        )
      : Object.values(data.data);

    const vaccines = filteredData.map(({ vaccine }) => vaccine);
    const uniqueVaccines = Array.from(new Set(vaccines));

    return uniqueVaccines;
  }, [data, selectedCountry]);

  const updateAvailableCountries = (start, end) => {
    if (!data) return [];

    const countries = Object.values(data.data)
      .filter(({ date }) => {
        const dateFormatted = new Date(date);
        return dateFormatted >= start && dateFormatted <= end;
      })
      .reduce((acc, { location }) => {
        if (!acc.includes(location)) acc.push(location);
        return acc;
      }, []);

    setAvailableCountries(countries);
  };

  useMemo(() => {
    updateAvailableCountries(startDate, endDate);
  }, [startDate, endDate, data]);

  const [formattedData] = useMemo(() => {
    if (!data) return [];

    const { dailyData } = data;
    const totalSalesLine = {
      id: "total_vaccinations",
      color: theme.palette.secondary.main,
      data: [],
    };
    const totalUnitsLine = {
      id: "people_vaccinated",
      color: theme.palette.secondary[600],
      data: [],
    };
    const totalLine = {
      id: "Полностью вакцинированы",
      color: theme.palette.secondary[400],
      data: [],
    };
    const totalUnits = {
      id: "Бустеры",
      color: theme.palette.secondary[600],
      data: [],
    };

    Object.values(data.data).forEach(
      ({
        date,
        total_vaccinations,
        people_vaccinated,
        location,
        vaccine,
        people_fully_vaccinated,
        total_boosters,
      }) => {
        const dateFormatted = new Date(date);
        if (dateFormatted >= startDate && dateFormatted <= endDate) {
          const splitDate = date.split("T")[0].substring(date.indexOf("-") + 1);

          if (
            (!selectedCountry || location === selectedCountry) &&
            (!selectedVaccine || vaccine === selectedVaccine)
          ) {
            totalSalesLine.data = [
              ...totalSalesLine.data,
              { x: splitDate, y: Number(total_vaccinations) || 0 },
            ];
            totalUnitsLine.data = [
              ...totalUnitsLine.data,
              { x: splitDate, y: Number(people_vaccinated) || 0 },
            ];
            totalLine.data = [
              ...totalLine.data,
              { x: splitDate, y: Number(people_fully_vaccinated) || 0 },
            ];
            totalUnits.data = [
              ...totalUnits.data,
              { x: splitDate, y: Number(total_boosters) || 0 },
            ];
          }
        }
      }
    );

    const formattedData = [
      totalSalesLine,
      totalUnitsLine,
      totalLine,
      totalUnits,
    ];
    return [formattedData];
  }, [data, startDate, endDate, selectedCountry, selectedVaccine]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="DAILY SALES" subtitle="Chart of daily sales" />
      <Box height="75vh">
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Box>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              onSelect={updateAvailableCountries}
            />
          </Box>
          <Box ml={2}>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              onSelect={updateAvailableCountries}
            />
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Box>
            <Select
              value={selectedCountry}
              onChange={(event) => setSelectedCountry(event.target.value)}
            >
              <MenuItem value="">All Countries</MenuItem>
              {availableCountries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box ml={2}>
            <Select
              value={selectedVaccine}
              onChange={(event) => setSelectedVaccine(event.target.value)}
            >
              <MenuItem value="">All Vaccines</MenuItem>
              {filteredVaccineOptions.map((vaccine) => (
                <MenuItem key={vaccine} value={vaccine}>
                  {vaccine}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {data ? (
          <ResponsiveLine
            data={formattedData}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: theme.palette.secondary[200],
                  },
                },
                legend: {
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
                ticks: {
                  line: {
                    stroke: theme.palette.secondary[200],
                    strokeWidth: 1,
                  },
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
              },
              legends: {
                text: {
                  fill: theme.palette.secondary[200],
                },
              },
              tooltip: {
                container: {
                  color: theme.palette.primary.main,
                },
              },
            }}
            colors={{ datum: "color" }}
            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 90,
              legend: "Month",
              legendOffset: 60,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Total",
              legendOffset: -50,
              legendPosition: "middle",
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                justify: false,
                translateX: 50,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        ) : (
          <>Loading...</>
        )}
      </Box>
    </Box>
  );
};

export default Daily;
