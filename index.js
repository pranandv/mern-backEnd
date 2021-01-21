const express = require("express");
const app=express();
const mongoose = require("mongoose");
const FriendModel=require("./models/Friends")
const cors = require("cors");
require('dotenv').config();

app.use(cors());
app.use(express.json())

//mongo db connection
mongoose.connect("mongodb+srv://mern-app:mern-app@cluster0.9thns.mongodb.net/mern-app?retryWrites=true&w=majority",{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("mongodb connection successfull");
}).catch((e)=>{
    console.log("error while connectiong server")
})

//router
app.post('/addFriend', async (req,res)=>{
    const name=req.body.name;
    const age=req.body.age;
    const friend=new FriendModel({name:name,age:age});
    await friend.save();
    res.send(friend);
});

app.get('/read',async (req,res)=>{
    FriendModel.find({},(err,result)=>{
        if(err)
        {
            res.send("error while reading data");
        }
        else
        {
            res.send(result);
        }
    });
})

app.put('/update',async (req,res)=>{
    const newAge=req.body.newAge;
    const id = req.body.id;

    try{
            await FriendModel.findById(id,(error,friendToUpdate)=> {
            friendToUpdate.age=Number(newAge);
            friendToUpdate.save();
        });
    }catch(err){
        console.log(err);
    } 
    res.send("updated");
})

app.delete('/delete/:id',async (req,res)=>{
    const id=req.params.id;
   await FriendModel.findByIdAndRemove(id).exec();
    res.send("item deleted");

});


//server 
app.listen(process.env.PORT || 4000,()=>{
    console.log("server running on port 4000");
})