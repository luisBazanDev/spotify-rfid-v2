import { ItemType, type Item } from "../types";
import { getItem, setItem } from "./DatabaseService";
import spotifyService from "./SpotifyService";

export async function readRFID(rfid: string): Promise<Item> {
  let data = getItem(rfid);

  if (!data) {
    data = { id: null, rfid_tag: rfid, type: ItemType.IDK };
    setItem(data);
  }

  return data;
}

export async function playRFID(rfid: string): Promise<boolean> {
  const data = await readRFID(rfid);

  if (!data.id) return false;

  const current = await spotifyService.getPlaying();

  const contextId = current?.context?.uri.split(":")[2];

  // Valid if the current context or track or episode is the same as the RFID
  switch (data.type) {
    case ItemType.ALBUM:
      if (
        current &&
        current.context?.type === "album" &&
        contextId === data.id
      ) {
        return true;
      }
      break;
    case ItemType.ARTIST:
      if (
        current &&
        current.context?.type === "artist" &&
        contextId === data.id
      ) {
        return true;
      }
      break;
    case ItemType.PLAYLIST:
      if (
        current &&
        current.context?.type === "playlist" &&
        contextId === data.id
      ) {
        return true;
      }
      break;
    case ItemType.PODCAST:
      if (
        current &&
        current.context?.type === "show" &&
        contextId === data.id
      ) {
        return true;
      }
      break;
    case ItemType.EPISODE:
      if (
        current &&
        current.context?.type === "episode" &&
        current.item?.id === data.id
      ) {
        return true;
      }
      break;
    case ItemType.TRACK:
      if (
        current &&
        current.currently_playing_type === "track" &&
        current.item?.id === data.id
      ) {
        return true;
      }
      break;
  }

  return await spotifyService.readRelation(data.type, data.id);
}
