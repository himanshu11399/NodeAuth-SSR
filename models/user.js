import mongoose from 'mongoose'


mongoose.connect(`mongodb://127.0.0.1:27017/authapp`);


const userSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    age:Number
},{timestamps:true});

const User=mongoose.model("User",userSchema);

export default User;


