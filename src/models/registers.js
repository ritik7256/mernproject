const mongoose=require("mongoose")
const bcrypt=require("bcrypt");
const jwt =require("jsonwebtoken")
const employeeSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,

    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,

    },
    gender:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
    },
    age:{
        type:Number,
        required:true,
        
    },
    password:{
        type:String,
        required:true,

    },
   confirmpassword:{
        type:String,
        required:true,
        
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
   
})

   employeeSchema.methods.generateAuthToken=async function(){
    try{
        const token=jwt.sign({_id:this._id},process.env.SECRET-KEY);
        console.log(token)
        this.tokens=this.tokens.concat({token:token})
        await this.save()
        return token


    }catch(e){
        res.send("the error part "+e)
    }
   }





employeeSchema.pre("save",async function(next){


    if(this.isModified("password")){

    
    const salt=await bcrypt.genSalt(10);

    // const passwordHash=await bcrypt.hash(this.password,salt)
    console.log(this.password)
    this.password=await bcrypt.hash(this.password,salt)
    this.confirmpassword=await bcrypt.hash(this.confirmpassword,salt)
    console.log(this.password);
    console.log(this.confirmpassword)
    }
    next();
    
})


const Register=new mongoose.model("Register",employeeSchema);
module.exports=Register;
