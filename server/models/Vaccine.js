import mongoose from "mongoose";

const VaccineDataSchema = new mongoose.Schema(
  {
    location: String,
    date: Date,
    vaccine: String,
    source_url: String,
    total_vaccinations: Number,
    people_vaccinated: Number,
    people_fully_vaccinated: Number,
    total_boosters: Number,
  }
);

const VaccineData = mongoose.model("Data", VaccineDataSchema);
export default VaccineData;
