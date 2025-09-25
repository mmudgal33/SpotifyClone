const Song = require('../Models/songmodel');


const getAllSongs = async () => {
    try {
        const songs = await Song.find(); 
        return songs;
    } catch (error) {
        throw new Error(`Error fetching songs: ${error.message}`);
    }
};

const saveSongIfNotExists = async (songData) => {
    try {
  
        if (!songData.fileUrl) {
            songData.fileUrl = 'N/A';
        }

        const existingSong = await Song.findOne({ title: songData.title, artist: songData.artist });
        if (!existingSong) {
            const newSong = new Song(songData);
            await newSong.save();
            console.log(`Service: Saved song - ${songData.title}`);
        } else {
            console.log(`Service: Song already exists - ${songData.title}`);
        }
    } catch (error) {
        console.error('Service: Error saving song:', error.message);
        throw new Error(`Error saving song: ${error.message}`);
    }
};


const searchSongs = async (query) => {
    try {
        const regex = new RegExp(query, 'i'); 
        return await Song.find({
            $or: [{ title: regex }, { artist: regex }, { genre: regex }],
        });
    } catch (error) {
        console.error('Service: Error searching songs:', error.message); 
        throw new Error(`Error searching songs: ${error.message}`);
    }
};

const addNewSong = async (songData) => {
    try {
        const newSong = new Song(songData);
        return await newSong.save(); 
    } catch (err) {
        throw new Error('Error adding song: ' + err.message);
    }
};

module.exports = {
    getAllSongs,
    searchSongs,
    saveSongIfNotExists,
    addNewSong,
};
