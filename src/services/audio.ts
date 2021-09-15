import SpotifyWebApi from 'spotify-web-api-node';

class Extractor {
    private access = new SpotifyWebApi()
    private song_ids:string[] = []

    init(){
        if(process.env.VUE_APP_SPOTI_TKN)
            this.access.setAccessToken(process.env.VUE_APP_SPOTI_TKN)
    }

    fetchPlaylist(link:string):Promise<Array<number>>{
        const id  = link.split('/')[4]
        this.song_ids = []
        
        return new Promise((resolve, reject) => {

           this.access.getPlaylistTracks(id)
           .then( data => {
              data.body.tracks.items.forEach( (song:any) => {
                  this.song_ids.push(song.track.id)
              })
              console.log(this.song_ids)
           }, err =>{
               console.log('something went wrong', err)
           } )


        }

        )
    }
}

export { Extractor };