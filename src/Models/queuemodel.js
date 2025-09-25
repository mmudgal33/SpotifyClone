const { Schema, model } = require('mongoose');

const QueueSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    songs: [
        { type: Schema.Types.ObjectId, ref: 'song' },
    ],
}, { timestamps: true });

const QueueModel = model('queue', QueueSchema);

module.exports = QueueModel;