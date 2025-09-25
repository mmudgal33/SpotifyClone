const express = require('express');
const { searchSpotify } = require('../Services/spotify');
const router = express.Router();
const SongController = require('../Controllers/songcontroller');


router.get('/', SongController.getAllSongs);



router.get('/search', (req, res, next) => {
    console.log('Search route hit with query:', req.query.q);
    next();
}, SongController.searchSongs);

router.post('/',SongController.postSong);


router.get('/search', async (req, res) => {
    const { query, type } = req.query;
    try {
        const results = await searchSpotify(query, type || 'track');
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;