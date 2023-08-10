// modules
import express from "express";
import bodyParser from "body-parser";
import mongoose  from "mongoose";
import encrypt from "mongoose-encryption";
import 'dotenv/config'



const Schema = mongoose.Schema;
const port = 3000;
const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/userDb")
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));



// SCHEMA
const userSchema = new Schema({
    email : String,
    password : String
})

//ENCRYPTION

userSchema.plugin(encrypt , {secret : process.env.SECRET , encryptedFields : ['password']})

 //MONGOOSE MODEL
const User = new mongoose.model("User",userSchema)

// HOME ROUTE
app.get("/" ,(req,res)=>{
    res.render("home.ejs")
})


// LOGIN ROUTE
app.get("/login" , (req,res)=>{
    res.render("login.ejs" )
});

app.post("/login",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    try {
        const foundName = await User.findOne({email:username})
        if(foundName){
            if(foundName.password===password){
                res.render('secrets');
            }else{
                console.log('Password Does not Match...Try Again !')
            }
        }else{
            console.log("User Not found...")
        }
    } catch (err) {
        console.log(err);
    }
});


// REGISTER ROUTE
app.get("/register",(req,res)=>{
    res.render("register.ejs")
})
app.post("/register" , (req,res)=>{

    try {
        const newUser = new User ({
            email : req.body.username,
            password : req.body.password
        });
        newUser.save() 
        res.render("secrets.ejs")
    } catch (error) {
        console.log(error);
    }
 })


// LISTENING PORT
app.listen(port , ()=>{
    console.log(`Listening on Port ${port}`);
})