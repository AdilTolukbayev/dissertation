import mongoose from "mongoose";

const VaccineDescSchema = new mongoose.Schema({
  vaccine: String,
  description: String,
  country: String,
});

const VaccineDesc = mongoose.model("Descriptions", VaccineDescSchema);
export default VaccineDesc;
