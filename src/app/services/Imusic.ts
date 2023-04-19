export interface TrackAPI {
  data: ITrack[] | IAlbum[] | IArtist[];
  total: number;
  next?: string;
}

export interface ITrack {
  id: number;
  title: string;
  title_short: string;
  title_version: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  md5_image: string;
  position: number;
  artist: IArtist;
  album: IAlbum;
  type: string;
}
export interface IAlbum {
  id: number;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  tracklist: string;
  type: string;
  nb_tracks?: number;
}

export interface IArtist {
  id: number;
  name: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  radio: boolean;
  tracklist: string;
  type: string;
}

export interface ILyrics{
  lyrics: string;
}

export interface ICard {
  type: string;
  id: number;
  trackTitle?: string;
  albumTitle?: string;
  title_short?: string;
  picture_medium?: string;
  tracklist?: string;
  artist?: IArtist;
  album?: IAlbum;
  albumID?: number;
  image264?: string;
  image500?: string;
  explicit_lyrics?: boolean;
  preview?: string;
  link?: string;
  artistName?: string;
  artistID?: number;
  nb_tracks?: number;
  release_date?: string;
}

// map object to ICard
export function mapToICard(object: any): ICard {
  let card: ICard = {
    type: object.type,
    id: object.id,
  };
  if (object.title != null && object.type == 'track') {
    card.trackTitle = object.title;
    card.albumTitle = object.album.title;
    card.artistName = object.artist.name;
    card.albumID = object.album.id;
    card.artistID = object.artist.id;
}
  if (object.title != null && object.type == 'album') {
    card.albumTitle = object.title;
    card.artistName = object.artist.name;
    card.artistID = object.artist.id;
}
  if (object.title_short != null) card.title_short = object.title_short;
  if (object.picture_medium != null)
    card.picture_medium = object.picture_medium;
  if (object.tracklist != null) card.tracklist = object.tracklist;
  if (object.artist != null) card.artist = object.artist;
  if (object.album != null) card.album = object.album;
  if (object.md5_image != null){ 
    card.image264 = "https://cdns-images.dzcdn.net/images/cover/" + object.md5_image +"/264x264.jpg";
    card.image500 = "https://cdns-images.dzcdn.net/images/cover/" + object.md5_image +"/500x500.jpg";}
  if (object.explicit_lyrics != null)
    card.explicit_lyrics = object.explicit_lyrics;
  if (object.preview != null) card.preview = object.preview;
  if (object.link != null) card.link = object.link;
  if (object.name != null) card.artistName = object.name;
  if (object.nb_tracks != null) card.nb_tracks = object.nb_tracks;
  if (object.release_date != null) card.release_date = object.release_date;

  return card;
}
