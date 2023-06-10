import express from "express";
import { getVaccineRaiting, procentCountries, getVaccineRaitingWithCountries } from "../controllers/general.js";
import { getGeography } from "../controllers/geo.js";
import { getAll, getAllTab } from "../controllers/tables.js";

const Router = express.Router();

Router.get("/vaccineRaiting", getVaccineRaiting);
Router.get("/vaccineCountry", getVaccineRaitingWithCountries);
Router.get("/getGeo", getGeography);
Router.get("/getAll", getAll);
Router.get("/getTab", getAllTab);
Router.get("/getProcent", procentCountries);

export default Router;
