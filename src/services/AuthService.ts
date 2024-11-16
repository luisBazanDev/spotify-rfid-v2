import { readFileSync, writeFileSync } from "fs";

type Auth = {
  user: string;
  token: string;
  refreshToken: string;
  code: string;
};

let auth: Auth = {
  user: "",
  token: "",
  refreshToken: "",
  code: "",
};

export const getAuth = () => {
  return auth;
};

export const setAuth = (newAuth: Auth) => {
  auth = newAuth;
  writeFileSync("auth.json", JSON.stringify(auth));
};

export const loadAuth = () => {
  try {
    const data = readFileSync("auth.json", "utf8");
    auth = JSON.parse(data);
  } catch (error) {
    console.error("Error loading auth", error);
    setAuth(auth);
  }
};

loadAuth();
