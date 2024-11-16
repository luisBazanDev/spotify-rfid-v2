import SpotifyWebApi from "spotify-web-api-node";
import request from "request";
import { Config } from "../Config";
import { getAuth, setAuth } from "./AuthService";
import type { ItemType } from "../types";

class SpotifyService {
  declare spotifyApi: SpotifyWebApi;
  declare profile: SpotifyApi.UserObjectPrivate | null;
  static instance: SpotifyService | null = null;

  constructor() {
    this.spotifyApi = new SpotifyWebApi({
      clientId: Config.SPOTIFY_CLIENT_ID,
      clientSecret: Config.SPOTIFY_CLIENT_SECRET,
      accessToken: getAuth().token,
      refreshToken: getAuth().refreshToken,
      redirectUri: Config.REDIRECT_URI,
    });
    this.profile = null;

    // Singleton pattern
    if (SpotifyService.instance) {
      return SpotifyService.instance;
    }

    SpotifyService.instance = this;
    return this;
  }

  /**
   * Valid credentials
   * @param {boolean} logger Log user in the console
   * @returns {boolean} True if the credentials are valid
   */
  async validToken(logger = false): Promise<boolean> {
    return new Promise((resolve) => {
      this.spotifyApi.getMe((err, res) => {
        if (
          (err && err.message === "The access token expired") ||
          !res ||
          !res.body
        ) {
          resolve(this.refreshToken());
        } else {
          if (logger) {
            console.log("token validated");
            console.log(`${res.body.display_name}(${res.body.id})`);
          }
          if (getAuth().user !== res.body.id) {
            setAuth({ ...getAuth(), user: res.body.id });
          }
          this.profile = res.body as SpotifyApi.UserObjectPrivate;
          resolve(true);
        }
      });
    });
  }

  /**
   * Method to refresh the token
   * @returns True if it was possible refresh the token.
   */
  async refreshToken(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const data = await this.spotifyApi.refreshAccessToken();
      if (!data.body.access_token) return resolve(false);

      // Update the token
      setAuth({ ...getAuth(), token: data.body.access_token });

      // Set the new token
      this.spotifyApi.setAccessToken(data.body.access_token);
      console.log("Token refresh");
      resolve(true);
    });
  }

  async getTokenFromCode(code: string): Promise<{
    access_token: string;
    token_type: string;
    refresh_token: string;
  } | null> {
    return new Promise((resolve) => {
      const requestAuthOptions = {
        url: "https://accounts.spotify.com/api/token",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              this.spotifyApi.getClientId() +
                ":" +
                this.spotifyApi.getClientSecret()
            ).toString("base64"),
        },
        form: {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: this.spotifyApi.getRedirectURI(),
        },
        json: true,
      };

      return request.post(requestAuthOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          resolve(body);
          spotifyService.spotifyApi.setAccessToken(body.access_token);
          spotifyService.spotifyApi.setRefreshToken(body.refresh_token);
          setAuth({
            ...getAuth(),
            token: body.access_token,
            refreshToken: body.refresh_token,
          });
          return;
        }
        resolve(null);
      });
    });
  }

  /**
   * Resolve object information
   */
  async readRelation(type: ItemType, id: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      var baseUri = "spotify:";
      switch (type) {
        case "ALBUM":
          resolve(await this.play(baseUri + `album:${id}`));
          break;
        case "ARTIST":
          resolve(
            await this.play("", {
              context_uri: baseUri + `artist:${id}`,
              offset: { position: 0 },
              position_ms: 0,
            })
          );
          break;
        case "PLAYLIST":
          resolve(await this.play(baseUri + `playlist:${id}`));
          break;
        case "PODCAST":
          resolve(await this.play(baseUri + `show:${id}`));
          break;
        case "TRACK":
          const trackInformation = await this.getTrackInformation(id);
          if (trackInformation === null) return resolve(false);
          resolve(
            await this.play("", {
              context_uri: trackInformation.album.uri,
              offset: { position: trackInformation.track_number - 1 },
              position_ms: 0,
            })
          );
          break;

        default:
          resolve(false);
          break;
      }
    });
  }

  /**
   * Play album in spotify
   */
  async play(
    spotifyUri: string,
    options = {
      context_uri: spotifyUri,
      position_ms: 0,
      offset: { position: 0 },
    }
  ): Promise<boolean> {
    if (!(await this.validToken())) {
      return false;
    }

    return new Promise((resolve) => {
      this.spotifyApi
        .play(options)
        .then((res) => {
          if (res.statusCode === 204) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          console.log(options);
          console.error(err);
          resolve(false);
        });
    });
  }

  /**
   * Resolve track information or null
   */
  async getTrackInformation(
    id: string
  ): Promise<SpotifyApi.SingleTrackResponse | null> {
    if (!(await this.validToken())) {
      return null;
    }

    return new Promise((resolve) => {
      this.spotifyApi
        .getTrack(id)
        .then((res) => {
          resolve(res?.body);
        })
        .catch((err) => {
          console.error(err);
          resolve(null);
        });
    });
  }

  /**
   * Get current playing track
   */
  async getPlaying(): Promise<SpotifyApi.CurrentlyPlayingResponse | null> {
    if (!(await this.validToken())) {
      return null;
    }

    return new Promise((resolve) => {
      this.spotifyApi
        .getMyCurrentPlayingTrack()
        .then((res) => {
          resolve(res?.body);
        })
        .catch((err) => {
          console.error(err);
          resolve(null);
        });
    });
  }
}

const spotifyService = new SpotifyService();

export default spotifyService;
