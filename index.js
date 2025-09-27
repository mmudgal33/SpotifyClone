// node --watch ./index.js

const express = require('express')
const cors = require('cors')
// const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000;
const mongoose = require("mongoose")
const authController = require('./controllers/authController')
const productController = require('./controllers/productController')
const uploadController = require('./controllers/uploadController')



// const main = require('./controllers/spotifyCode')
const spotifyController = require('./controllers/spotifyController')
const app = express()

// connect our db

// mongo_url="mongodb://127.0.0.1:27017/foodOrderingApp";
// mongoose.set('strictQuery', false)
// // mongoose.connect(process.env.MONGO_URL, () => console.log('DB is successfully connected'))
// mongoose.connect(mongo_url, () => console.log('DB is successfully connected'))

mongoose.set('strictQuery', false)
mongoose.connect('mongodb://localhost:27017/foodOrderingApp')
    .then(() => console.log('connection successful'))
    .catch((err) => console.log(err));

// routes & middlewares
// those two middlewares make req.body accessible, otherwise it would be undefined!!!
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/images', express.static('public/images'))

// app.get('/info', (req, res) => {
//     res.send({display_name, display_email, res_token});
// });









app.use('/auth', authController)
app.use('/product', productController)
app.use('/upload', uploadController)

app.use('/spotify', spotifyController)














// start our server
// app.listen(process.env.PORT, () => console.log('Server has been started successfully'))
// app.listen(port, () => console.log('Server has been started successfully'))
app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log(`Login URL: http://localhost:${port}/login`);
    });

// server is on port 5000, client is on port 3000,
// we are going to get a cors ERROR!!, but cors() removes that's error














// body -> raw -> json

// UNDERSTAND PLAYLISTS IN DB BUT PLAYLIST HERE

// ctrl c
// cmd -> mongosh

// mongosh
// show dbs -> oram db created
// use oram
// show collections -> userdatas created
// db.users.find()
// .exit

// ttchannel>
// db.users.drop()
// db.oram.users.dropIndex("age_1")
// db.users.getIndexes()
// db.dropDatabase()

// db.users.updateOne({_id:"68b32b1992dd4db42dd0e44f"},{$set:{"isAdmin":true}})

// db.Owners.update({ _id: req.params.id },{"$set":{"active":false}})
//   .then(dbModel => res.json(dbModel))
//   .catch(err => res.status(422).json(err));
 
// db.users.updateOne({ _id: ObjectId("68b32b1992dd4db42dd0e44f")},{$set:{ isAdmin: true}})

// db.users.updateOne({username: 'mmudgal33'},{$set:{ isAdmin: true}})


// {
//     _id: ObjectId("68b32b1992dd4db42dd0e44f"),
//     username: 'mmudgal33',
//     email: 'mmudgal33@gmail.com',
//     password: '$2b$10$fzsGt3lX/l1ii63B43X72OjPSnfxz8yyMAAmvIgSNxCYf6QLl6s52',   // Trivenikaul@33
//     isAdmin: true,
//     __v: 0
//   },