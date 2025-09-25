const express = require('express');
const router = express.Router();
const PlaylistController = require('../Controllers/playlistcontroller');

router.post('/', PlaylistController.createPlaylist);
router.get('/', PlaylistController.getPlaylists);
router.post('/:id/add', PlaylistController.addSongToPlaylist);
router.delete('/:id/remove', PlaylistController.removeSongFromPlaylist);

module.exports = router;
