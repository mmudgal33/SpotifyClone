const express = require('express');
const router = express.Router();
const PlaybackController = require('../Controllers/playbackcontroller');

router.post('/play', PlaybackController.playSong);
router.post('/pause', PlaybackController.pauseSong);
router.post('/resume', PlaybackController.resumeSong);
router.post('/skip', PlaybackController.skipSong);

module.exports = router;
