const express = require('express');
const router = express.Router();
const LibraryController = require('../Controllers/librarycontroller');


router.post('/like', LibraryController.likeSong);


router.get('/liked', LibraryController.getLikedSongs);


router.delete('/like/:id', LibraryController.removeLikedSong);


router.get('/playlists', LibraryController.getUserPlaylists);

module.exports = router;
