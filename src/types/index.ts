export enum ItemType {
  ALBUM = "ALBUM",
  ARTIST = "ARTIST",
  PLAYLIST = "PLAYLIST",
  PODCAST = "PODCAST",
  TRACK = "TRACK",
  EPISODE = "EPISODE",
  IDK = "IDK",
}

export type Item = {
  rfid_tag: string;
  type: ItemType;
  id: string | null; // Spotify ID
};

export type Database = Item[];
