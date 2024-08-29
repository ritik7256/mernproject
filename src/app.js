require('dotenv').config()



const express=require("express")
const app=express()
require("./db/connection")
const path=require("path")
const hbs=require("hbs")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");

const Register=require("./models/registers");

app.use(express.json());
app.use(express.urlencoded({extended:false}))

const port=process.env.PORT || 3000;

const static_path=path.join(__dirname,"../public");
const templates_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials")

app.use(express.static(static_path));


app.set("view engine","hbs");
app.set("views",templates_path)
hbs.registerPartials(partials_path)

console.log(process.env.SECRET_KEY)
app.get("/",(req,res)=>{
  res.render("index")
})
app.post("/register",async(req,res)=>{
    try{  
     const password=req.body.password;
     const confirmPassword=req.body.confirmpassword;
     if(password===confirmPassword){
      const registerEmployee=new Register({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        gender:req.body.gender,
        phone:req.body.Phone,
        age:req.body.age,
        password:req.body.password,
        confirmpassword:req.body.confirmpassword
      })
         
     const token=await registerEmployee.generateAuthToken();

      
      
      //middleware 
     const registered= await registerEmployee.save()
     res.status(201).render("index");

     
     }else{
      res.send("password not matching")
     }

    }catch(e){
      res.status(400).send(e)
    }
})
app.get("/register",(req,res)=>{
  res.render("register")
})
app.get("/login",(req,res)=>{
  res.render("login")
})
app.post("/login",async(req,res)=>{
  try{
    const email=req.body.email;
    const password=req.body.password;


   const useremail= await Register.findOne({email:email});
    const isMatch=await bcrypt.compare(password,useremail.password);

   

    if(isMatch){

      const token =await useremail.generateAuthToken();
      

      return res.status(201).render("index")

    }
    else{
      return res.send("something went wrong")
    }

  }catch(e){
    console.log(e)
  }
  
})
app.listen(port,()=>{
    console.log("connected")
})








