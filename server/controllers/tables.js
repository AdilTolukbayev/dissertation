import VaccineData from "../models/vaccine.js";

export const getAll = async (req, res) => {
  try {
    // const data = await VaccineData.find();
    // res.status(200).json(data);
    // sort should look like this: { "field": "userId", "sort": "desc"}
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    const data = await VaccineData.find({
      $or: [
        { vaccine: { $regex: new RegExp(search, "i") } },
        // { _id: { $regex: new RegExp(search, "i") } },
        { location: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    // Производим расчеты для свойства people_fully_vaccinated при его отсутствии
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      // const date = new Date(item.date);
      // const formattedDate = date.toISOString().split("T")[0];
      // item.date = formattedDate;

      if (!item.people_fully_vaccinated) {
        item.people_fully_vaccinated =
          item.total_vaccinations - item.people_vaccinated;
      }
    }

    const total = await VaccineData.countDocuments({
      location: { $regex: search, $options: "i" },
    });

    res.status(200).json({
      data,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllTab = async (req, res) => {
  try {
    const data = await VaccineData.find();
    res.status(200).json({data});
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
