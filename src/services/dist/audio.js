"use strict";
exports.__esModule = true;
exports.Extractor = void 0;
var spotify_web_api_node_1 = require("spotify-web-api-node");
var Extractor = /** @class */ (function () {
    function Extractor() {
        this.access = new spotify_web_api_node_1["default"]();
        this.song_ids = [];
    }
    Extractor.prototype.init = function () {
        if (process.env.VUE_APP_SPOTI_TKN)
            this.access.setAccessToken(process.env.VUE_APP_SPOTI_TKN);
    };
    Extractor.prototype.fetchPlaylist = function (link) {
        var _this = this;
        var id = link.split('/')[4];
        this.song_ids = [];
        return new Promise(function (resolve, reject) {
            _this.access.getPlaylistTracks(id)
                .then(function (data) {
                data.body.tracks.items.forEach(function (song) {
                    _this.song_ids.push(song.track.id);
                });
                console.log(_this.song_ids);
            }, function (err) {
                console.log('something went wrong', err);
            });
        });
    };
    return Extractor;
}());
exports.Extractor = Extractor;
