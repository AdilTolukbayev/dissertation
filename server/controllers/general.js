import VaccineData from "../models/vaccine.js";
import VaccineDesc from "../models/Desc.js";

// Функция для преобразования количества упоминаний в оценку от 1 до 5
function getRating(count, maxCount) {
  const percentage = (count / maxCount) * 100;
  return Math.ceil(percentage / 20);
}

export const getVaccineRaiting = async (req, res) => {
  try {
    const data = await VaccineData.find();
    const desc = await VaccineDesc.find();
    // Создаем объект, в котором будет храниться количество упоминаний каждой вакцины
    const vaccineCounts = {};

    // Перебираем данные и увеличиваем счетчик для каждой вакцины
    data.forEach((record) => {
      const vaccines = record.vaccine.split(", ");
      vaccines.forEach((vaccine) => {
        if (vaccineCounts[vaccine]) {
          vaccineCounts[vaccine] += 1;
        } else {
          vaccineCounts[vaccine] = 1;
        }
      });
    });

    // Создаем массив объектов из счетчика вакцин для сортировки
    const vaccineRankings = Object.keys(vaccineCounts).map((vaccine) => {
      return { vaccine, count: vaccineCounts[vaccine] };
    });

    // Сортируем вакцины по количеству упоминаний в нисходящем порядке
    vaccineRankings.sort((a, b) => b.count - a.count);

    // Максимальное количество упоминаний для вакцины
    const maxCount = vaccineRankings[0].count;

    vaccineRankings.forEach((vaccine) => {
      const rating = getRating(vaccine.count, maxCount);
      const matchingDesc = desc.find((descItem) => descItem.vaccine === vaccine.vaccine);
      vaccine.rating = rating;
      vaccine.description = matchingDesc
    });

    res.status(200).json(vaccineRankings);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getVaccineRaitingWithCountries = async (req, res) => {
  try {
    const data = await VaccineData.find();
    // Создаем объект, в котором будет храниться количество упоминаний каждой вакцины
    const vaccineCounts = {};

    // Перебираем данные и увеличиваем счетчик для каждой вакцины для каждой страны
    data.forEach((record) => {
      const location = record.location;
      const vaccines = record.vaccine.split(", ");
      vaccines.forEach((vaccine) => {
        const key = `${location}_${vaccine}`;
        if (vaccineCounts[key]) {
          vaccineCounts[key]++;
        } else {
          vaccineCounts[key] = 1;
        }
      });
    });

    // Создаем массив объектов из счетчика вакцин для сортировки
    const vaccineRankings = Object.keys(vaccineCounts).map((vaccine) => {
      const [location, vaccineName] = vaccine.split("_");
      return { location, vaccine: vaccineName, count: vaccineCounts[vaccine] };
    });

    // Сортируем вакцины по количеству упоминаний в нисходящем порядке
    vaccineRankings.sort((a, b) => b.count - a.count);

    // Максимальное количество упоминаний для вакцины
    const maxCount = vaccineRankings[0].count;

    vaccineRankings.forEach((vaccine) => {
      const rating = getRating(vaccine.count, maxCount);
      vaccine.rating = rating;
    });

    res.status(200).json(vaccineRankings);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const procentCountries = async (req, res) => {
  try {
    const data = await VaccineData.find();

    const updatedData = data.reduce(
      (
        acc,
        {
          location,
          vaccine,
          people_fully_vaccinated,
          people_vaccinated,
          total_vaccinations,
        }
      ) => {
        if (!people_fully_vaccinated) {
          people_fully_vaccinated = total_vaccinations - people_vaccinated;
        }

        if (!acc[location]) {
          acc[location] = {
            vaccines: [],
            percentage_fully_vaccinated: 0,
          };
        }

        const vaccinesList = vaccine.split(", ");
        acc[location].vaccines.push(...vaccinesList);

        if (
          people_fully_vaccinated > acc[location].percentage_fully_vaccinated
        ) {
          const percentage =
            (people_fully_vaccinated / total_vaccinations) * 100;
          acc[location].percentage_fully_vaccinated =
            Math.round(percentage * 100) / 100; // Округляем до двух знаков после запятой
        }

        return acc;
      },
      {}
    );

    const formattedLocations = Object.entries(updatedData).map(
      ([location, { vaccines, percentage_fully_vaccinated }]) => {
        const uniqueVaccines = [...new Set(vaccines)];

        return { id: location, vaccines: uniqueVaccines, percentage_fully_vaccinated };
      }
    );

    formattedLocations.sort().reverse();

    res.status(200).json(formattedLocations);

    // console.log(updatedData);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
