const { Schema, model } = require('mongoose');

const PlaylistSchema = new Schema({
    name: {
        type: 'String',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    songs: [
        { type: Schema.Types.ObjectId, ref: 'song' },
    ],
}, { timestamps: true });

const PlaylistModel = model('playlist', PlaylistSchema);

module.exports = PlaylistModel;