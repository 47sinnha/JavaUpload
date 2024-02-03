const mongoose=require("mongoose");
const bcrypt =require("bcryptjs"); 
const jwt = require("jsonwebtoken")

mongoose.connect("mongodb://localhost:27017/Final", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

.then(()=>{
    console.log("mongodb connected");
})
.catch(()=>{
    console.log("failed to connect");
})

const signInschema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    }
})

const signUpSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true
    },

    username:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },

    cp:{
        type:String,
        required:true 
    },
    tokens:[{
        token:{
            type:String, 
            required:true
        }
    }]

})

  
//generating tokens
signUpSchema.methods.generateAuthToken = async function(){
try {
   const token =  jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
   this.tokens= this.tokens.concat({token:token});
   await this.save(); 
   console.log(token);
   return token; 
} catch (error) {
    res.send("the error part" + error); 
    console.log("the error part" + error);
}
}











signUpSchema.pre("save", async function(next){
    try {
        if(this.isModified("password")){
            console.log(`the current password is ${this.password}`);
            this.password = await bcrypt.hash(this.password, 10);
            console.log(`the hashed password is ${this.password}`);
            this.cp = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (error) {
        next(error);
    }
});





const SignInUser =mongoose.model("SignInUser", signInschema);
const SignUpUser =mongoose.model("SignUpUser", signUpSchema);

module.exports= {SignInUser, SignUpUser};
