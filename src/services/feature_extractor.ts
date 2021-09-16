import SpotifyWebApi from 'spotify-web-api-node';
//@ts-ignore
import TSNE from 'tsne-js'

class Extractor {
    private access = new SpotifyWebApi()
    private model: TSNE;


    init() {
        if (process.env.VUE_APP_SPOTI_TKN)
            this.access.setAccessToken(process.env.VUE_APP_SPOTI_TKN)
        
        this.model = new TSNE({
            dim: 2,
            perplexity: 30.0,
            earlyExaggeration: 4.0,
            learningRate: 100.0,
            nIter: 1000,
            metric: 'euclidean'
        })
    }

    fetchPlaylist(link: string): Promise<Array<string>> {
        const id = link.split('/')[4]
        const songs: Array<string> = []

        return new Promise((resolve) => {
            this.access.getPlaylistTracks(id)
                .then(data => {
                    (data.body as any).tracks.items.forEach((song: any) => { // ts type error, the server response has different format
                        songs.push(song.track.id)
                    })
                    resolve(songs)
                }, err => {
                    console.log('something went wrong', err)
                })
        }
        )
    }

    extractFeatures(song_ids: string[]): Promise<Array<number[]>> {
        const features: Array<number[]> = []
        return new Promise((resolve, reject) => {
            this.access.getAudioFeaturesForTracks(song_ids).then( (response:any) => {
                response.body.audio_features.forEach( (s:any) => {
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
                        s.valence
                    ]);
                })

                resolve(features)
            })  
        })
    }

    trainModel(features: any) {
        console.log(features)
        this.model.init({data: features})
        this.model.run();

        // `output` is unpacked ndarray (regular nested javascript array)
        const output = this.model.getOutput();

        console.log(output)
            }

}

export { Extractor };