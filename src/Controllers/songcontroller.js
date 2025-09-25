const SongService = require('../Services/songservice');
const { searchSpotify } = require('../Services/spotify');



const getAllSongs = async (req, res) => {
    try {
        const songs = await SongService.getAllSongs();
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch songs: ${error.message}` });
    }
};

const searchSongs = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }


        const spotifyTracks = await searchSpotify(query, 'track');


        res.status(200).json(spotifyTracks);
    } catch (error) {
        res.status(500).json({ error: `Failed to search songs: ${error.message}` });
    }
};


const postSong = async (req, res) => {
    const songData = {
        title: req.body.title,
        artist: req.body.artist,
    };

    try {
        const savedSong = await SongService.addNewSong(songData);
        res.status(201).send({
            msg: 'Song added successfully!',
            song: savedSong,
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

module.exports = {
    getAllSongs,
    searchSongs,
    postSong,
};
