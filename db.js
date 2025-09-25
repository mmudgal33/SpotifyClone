const mongoose=require('mongoose');

const initiateDBConnection=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_CONNECTION_URI);
    }
catch (error){
    console.log(error);
}
    };
module.exports=initiateDBConnection;