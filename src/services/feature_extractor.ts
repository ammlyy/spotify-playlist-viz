import SpotifyWebApi from "spotify-web-api-node";
//@ts-ignore
import TSNE from "tsne-js";

interface Song {
  title: string,
  artist: string,
  id: string
}

interface Playlist {
  title: string,
  description: string,
  author: string,
  songs_list: Array<Song>
}
class Extractor implements Playlist {
  private access = new SpotifyWebApi();
  private model: TSNE;
  private songs: Array<string> = [];
  title:string = ""
  description:string = ""
  author:string = ""
  songs_list: Array<Song> = []

  init() {
    if (process.env.VUE_APP_SPOTI_TKN)
      this.access.setAccessToken(process.env.VUE_APP_SPOTI_TKN);

    this.model = new TSNE({
      dim: 3,
      perplexity: 30.0,
      earlyExaggeration: 5,
      learningRate: 100.0,
      nIter: 1000,
      metric: "manhattan",
    });
  }

  fetchPlaylist(link: string): Promise<Array<Song>> {
    const id = link.split("/")[4];
    this.songs = [];

    return new Promise((resolve) => {
      this.access.getPlaylist(id).then((response) => {
        this.title = response.body.name
        this.author = response.body.owner.display_name ? response.body.owner.display_name : ""
        this.description = response.body.description ? response.body.description : ""
        response.body.tracks.items.forEach((song:any)=>{
          this.songs_list.push({
            title:song.track.name,
            artist: song.track.artists[0].name,
            id: song.track.id
          })
          
        });
        resolve(this.songs_list)
      })
   
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
      return out
  }
}

export { Extractor };
