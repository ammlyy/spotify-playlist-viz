"use strict";
exports.__esModule = true;
exports.Extractor = void 0;
var spotify_web_api_node_1 = require("spotify-web-api-node");
// @ts-ignore
var tsne_js_1 = require("tsne-js");
var Extractor = /** @class */ (function () {
    function Extractor() {
        this.access = new spotify_web_api_node_1["default"]();
        this.model = new tsne_js_1["default"]({
            dim: 2,
            perplexity: 30.0,
            earlyExaggeration: 4.0,
            learningRate: 100.0,
            nIter: 1000,
            metric: 'euclidean'
        });
    }
    Extractor.prototype.init = function () {
        if (process.env.VUE_APP_SPOTI_TKN)
            this.access.setAccessToken(process.env.VUE_APP_SPOTI_TKN);
    };
    Extractor.prototype.fetchPlaylist = function (link) {
        var _this = this;
        var id = link.split('/')[4];
        this.features = [];
        return new Promise(function (resolve, reject) {
            _this.access.getPlaylistTracks(id)
                .then(function (data) {
                data.body.tracks.items.forEach(function (song) {
                    _this.access.getAudioFeaturesForTrack(song.track.id).then(function (features) {
                        _this.features.push([
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
                        ]);
                    });
                });
            }, function (err) {
                console.log('something went wrong', err);
            });
        });
    };
    return Extractor;
}());
exports.Extractor = Extractor;
