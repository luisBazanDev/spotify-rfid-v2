import { Router } from "express";
import querystring from "query-string";
import { Config } from "../Config";
import spotifyService from "../services/SpotifyService";

const auth = Router();

auth.get("/login", (req, res) => {
  /*
  Scopes:
  - user-read-private
  - user-read-currently-playing
  - user-read-playback-state
  - user-modify-playback-state
  */
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-read-playback-state",
    "user-modify-playback-state",
  ];

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: Config.SPOTIFY_CLIENT_ID,
        scope: scopes.join(" "),
        redirect_uri: Config.REDIRECT_URI,
      })
  );
});

auth.get("/callback", async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    res.send("Invalid code");
    return;
  }

  // Try get credentials
  const credentials = await spotifyService.getTokenFromCode(code);

  if (!credentials) {
    res.send("Invalid code");
    return;
  }

  console.log(await spotifyService.getTokenFromCode(code));

  res.redirect("/test/valid");
});

export default auth;
