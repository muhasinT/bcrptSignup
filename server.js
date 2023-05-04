 const express = require("express");
const bcrpt = require("bcrypt");
const session= require("express-session");
const cookieParser = require("cookie-parser");
const saltRound = 10;
 
const app = express();

app.use(session({
    secret:'mySecretkey',
    saveUninitialized:false,
    resave:false,
    name:'MY Website'
}));


app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const users = [
    {username:'feroz',password:'$2b$10$yZwPoeoiopO1cEAfHzuuA.U0qkKhP.ibnX731FYcxB/l58z11AwZ6'},
    {username:'muhasin',password:'$2b$10$ikKmi2Jfv28sNoBRENK9DOCSKQ131ZbsptFdyOn0go9ohQjHP9C1u'}

]

app.get('/',(req,res)=>{
    console.log(req.session);
    if(!req.session.isAuth){
        res.sendFile(__dirname + "/signup.html");
    }else{
        res.sendFile(__dirname + "/profile.html");

    }
})
app.post('/signup',(req,res) =>{
    const {username, password} = req.body;     // decrypt username and password //
    bcrpt.hash(password,saltRound,function(err,hash){  // adding random strings to avoid decrypt the password using 'saltRound'//
        console.log(hash);
    })
    res.sendFile(__dirname + "/login.html");
})
app.get('/login', (req,res)=>{
    console.log(req.session);
    res.sendFile(__dirname + "/login.html");
});
app.get('/profile', (req,res)=>{
    if(!req.session.isAuth){
        res.sendFile(__dirname + "/login.html");
    }
    res.sendFile(__dirname + "/profile.html");
});
app.post('/login', (req,res)=>{
    const {username, password} = req.body; 
   const targetUser =  users.find((user) => user.username === username); 
   if(!targetUser){
    res.send('Invalid username and password');
   }
   bcrpt.compare(password, targetUser.password, function(err,result){ 
    if(result){
        console.log(result);
        req.session.userId = username;
        req.session.isAuth = true;
        res.sendFile(__dirname + "/profile.html");

    }else{
        console.log(result);
        res.send('Invalid username and password');
    }
   })
});
app.get("/logout",(req,res) => {
    res.clearCookie("MY Website");
    res.sendFile(__dirname + "/signup.html")
})
app.listen(3001,()=>{
    console.log('Server is up');
})