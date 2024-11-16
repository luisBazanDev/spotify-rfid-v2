import { configDotenv } from "dotenv";

configDotenv();

type Config = {
  SPOTIFY_CLIENT_ID?: string;
  SPOTIFY_CLIENT_SECRET?: string;
  REDIRECT_URI: string;
};

export const Config: Config = {
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  REDIRECT_URI: "http://localhost:3000/auth/callback",
};
