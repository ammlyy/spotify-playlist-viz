import SpotifyWebApi from "spotify-web-api-node";
//@ts-ignore
import TSNE from "tsne-js";

interface Song {
  title: string;
  artist: string;
  img: string;
  id: string;
}

interface Playlist {
  title: string;
  description: string;
  author: string;
  songs_list: Array<Song>;
}
class Extractor implements Playlist {
  private access = new SpotifyWebApi();
  
  private model: TSNE;
  title: string = "";
  description: string = "";
  author: string = "";
  songs_list: Array<Song> = [];

  constructor() {



this.model = new TSNE({
      dim: 2,
      perplexity: 30.0,
      earlyExaggeration: 5,
      learningRate: 50.0,
      nIter: 2000,
      metric: "euclidean",
    });
  }

  fetchPlaylist(link: string): Promise<Array<Song>> {
    console.log(String(window.location).split('#')[1])
    const url = String(window.location).split('#')[1]
    const params = new URLSearchParams(url)
    const TKN = params.get('access_token') 
    this.access.setAccessToken(TKN ? TKN : '');
    const id = link.split("/")[4];
    this.songs_list = [];

    return new Promise((resolve) => {
      this.access.getPlaylist(id).then((response) => {
        this.title = response.body.name;
        this.author = response.body.owner.display_name
          ? response.body.owner.display_name
          : "";
        this.description = response.body.description
          ? response.body.description
          : "";
        response.body.tracks.items.forEach((song: any) => {
          this.songs_list.push({
            title: song.track.name,
            artist: song.track.artists[0].name,
            img: song.track.album.images[1].url,
            id: song.track.id,
          });
        });
        resolve(this.songs_list);
      });
    });
  }

  extractFeatures(song_ids: string[]): Promise<Array<number[]>> {
    const features: Array<number[]> = [];
    return new Promise((resolve) => {
      this.access.getAudioFeaturesForTracks(song_ids).then((response: any) => {
        response.body.audio_features.forEach((s: any) => {
          features.push([
            s.acousticness,
            s.danceability,
            s.instrumentalness,
            s.energy,
            s.key,
            s.liveness,
            s.loudness,
            s.mode,
            s.speechiness,
            s.tempo,
            s.time_signature,
            s.valence,
          ]);
        });

        resolve(features);
      });
    });
  }

  trainModel(features: Array<number[]>): Array<number[]> {
    this.model.init({ data: features });
    this.model.run();
    const out = this.model.getOutputScaled();
    return out;
  }
}

export { Extractor };
