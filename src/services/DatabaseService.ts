import { readFile, writeFile } from "fs/promises";
import type { Database, Item } from "../types";

let database: Database = [];

export const loadDatabase = async () => {
  try {
    const data = await readFile("database.json", "utf-8");
    database = JSON.parse(data);
  } catch (error) {
    console.error("Error loading database", error);
    saveDatabase();
  }
};

export const saveDatabase = async () => {
  try {
    await writeFile("database.json", JSON.stringify(database, null, 2));
  } catch (error) {
    console.error("Error saving database", error);
  }
};

export const getDatabase = () => database;

export const getItem = (rfid_tag: string): Item | undefined => {
  return database.find((item) => item.rfid_tag === rfid_tag);
};

export const setItem = (item: Item) => {
  const index = database.findIndex((i) => i.rfid_tag === item.rfid_tag);

  if (index === -1) {
    database.push(item);
  } else {
    database[index] = item;
  }

  saveDatabase();
};

loadDatabase();
