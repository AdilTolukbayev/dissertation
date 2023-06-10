import VaccineData from "../models/vaccine.js";
import fs from "fs";

export const getGeography = async (req, res) => {
  try {
    const data = await VaccineData.find();

    // Чтение файла JSON
    const jsonString = fs.readFileSync("data/countries.json", "utf8");

    // Преобразование JSON в объект
    const jsonArray = JSON.parse(jsonString);

    const mappedLocations = data.reduce((acc, { location, vaccine, people_fully_vaccinated }) => {
      // Найти соответствующий код ISO3 в массиве маппингов
      const countryMapping = jsonArray.find(
        (item) => item.countryName === location
      );

      // Получить код ISO3 страны или использовать исходное название, если сопоставление не найдено
      const countryCode = countryMapping ? countryMapping.iso3 : location;

      if (!acc[countryCode]) {
        acc[countryCode] = {
          vaccines: [],
          value: 0,
        };
      }

      const vaccinesList = vaccine.split(", ");
      acc[countryCode].vaccines.push(...vaccinesList);

      if (people_fully_vaccinated > acc[countryCode].value) {
        acc[countryCode].value = people_fully_vaccinated;
      }

      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([location, { vaccines, value }]) => {
        const uniqueVaccines = [...new Set(vaccines)];

        return { id: location, vaccines: uniqueVaccines, value };
      }
    );

    // Найти максимальное значение value
    const maxVaccinations = Math.max(...formattedLocations.map(({ value }) => value));

    formattedLocations.push(maxVaccinations);

    console.log(formattedLocations);

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
