const { Schema, model } = require('mongoose');

const SongSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        required: true,
    },
    album: {
        type: String
    },
    genre: {
        type: String
    },
    duration: {
        type: Number
    },
    fileUrl: {
        type: String,
        required: false,
    },
}, { timestamps: true });

const Song = model('Song', SongSchema);

module.exports = Song;
