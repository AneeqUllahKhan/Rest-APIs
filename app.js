const express = require("express");
const { default: mongoose } = require("mongoose");
const userModel = require("./models/user");
const app = express();
const PORT = process.env.PORT || 5000;

const DBURI = "mongodb+srv://admin:admin@cluster0.rbv3k1z.mongodb.net/crudapp";

mongoose.connect(DBURI)
.then((res)=>console.log("Mongo DB Connected"))
.catch((err)=>console.log("DB ERROR", err));

// Body-Parser
app.use(express.json())

// Get User //63cd37c6343822379904231c
app.get("/api/user/:userid", (request, response)=>{
    
    const { userid } = request.params;
    userModel.findById(userid, (err,data)=>{
        if(err){
            response.json({
                message:`Internal Error:${err}`,
                status: false,
            });
        }else{
            response.json({
                message: "User GET Successfully",
                data: data,
                status: true,
            })
        }
    })


})


app.post("/api/user", (request, response)=>{

    const {firstName, lastName ,password , email } = request.body || {};

    if(!firstName || !lastName || !email || !password){
        response.json({
            message:"Required field is missing",
            status: false
        })
    }

    const objToSend ={
        first_name : firstName,
        last_name :  lastName,
        email : email,
        password : password
    }
    userModel.create(objToSend, (err, data)=>{
        if(err){
            response.json({
                message:`Internal Error:${err}`,
                status: false,
            });
        }else{
            response.json({
                message: "User Created Successfully",
                data: data,
                status: true,
            })
        }
    });
    // response.send("Create Users");
})


app.put("/api/user", (request, response)=>{
    response.send("Update Users");
})


app.delete("/api/user", (request, response)=>{
    response.send("Delete Users");
})

app.listen(PORT, () =>
  console.log(`server running on http://localhost:${PORT}`)
);
