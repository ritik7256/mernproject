const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/loginform")
.then(()=>{
    console.log("this is connected");
    
}).catch((e)=>{
    console.log(e)
})


