const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: 'String',
        required: true,
        unique: true,
    },
    email: {
        type: 'String',
        required: true,
        unique: true,
    },
    password: {
        type: 'String',
        required: true,
    },
    likedSongs: [
        { type: Schema.Types.ObjectId, ref: 'song' },
    ],
}, { timestamps: true });

const UserModel = model('user', UserSchema);

module.exports = UserModel;