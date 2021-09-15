import SpotifyWebApi from 'spotify-web-api-node';
// @ts-ignore
import tsne from 'tsne-js'

class Extractor {
    private access = new SpotifyWebApi()
    private features: any
    private model: tsne = new tsne({
        dim: 2,
        perplexity: 30.0,
        earlyExaggeration: 4.0,
        learningRate: 100.0,
        nIter: 1000,
        metric: 'euclidean'
    });

    init() {
        if (process.env.VUE_APP_SPOTI_TKN)
            this.access.setAccessToken(process.env.VUE_APP_SPOTI_TKN)
    }

    fetchPlaylist(link: string): Promise<Array<number>> {
        const id = link.split('/')[4]
        this.features = []

        return new Promise(() => {
            this.access.getPlaylistTracks(id)
                .then(data => {
                    (data.body as any).tracks.items.forEach((song: any) => { // ts type error, the server response has different format

                        this.access.getAudioFeaturesForTrack(song.track.id).then(features => {
                            this.features.push([
                                features.body.acousticness,
                                features.body.danceability,
                                features.body.instrumentalness,
                                features.body.energy,
                                features.body.key,
                                features.body.loudness,
                                features.body.liveness,
                                features.body.mode,
                                features.body.speechiness,
                                features.body.tempo,
                                features.body.time_signature,
                                features.body.valence

                            ])
                        })
                    })/*.then( () => {
                    this.model.init(this.features)
                    this.model.run()
                    console.log(this.features)
                })*/
                }, err => {
                    console.log('something went wrong', err)
                })


        }

        )
    }

}

export { Extractor };