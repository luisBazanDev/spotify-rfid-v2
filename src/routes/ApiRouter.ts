import { Router } from "express";
import { getDatabase } from "../services/DatabaseService";

const api = Router();

api.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

const rfid = Router();

rfid.get("/all", (req, res) => {
  const database = getDatabase();

  res.json(database);
});

api.use("/rfid", rfid);

export default api;
