const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const {genrateFile} = require('./generateFile')
const {executeCpp} = require("./executeCPP")

mongoose.connect(
    "mongodb://localhost/compilerdb",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      err && console.error(err);
      console.log("Successfully connected to MongoDB: compilerdb");
    }
  );
  


const app = express();


  


app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/', (req,res) => {
    return res.json({hello:"world!!"})
})

app.post('/run',async (req,res) => {

    const {language="cpp",code} = req.body

    if(code === undefined){
        return res.status(400).json({status:false,message:"Empty code body"});
    }
    try{

        const filepath = await genrateFile(language,code);
        const output = await executeCpp(filepath);
        return res.json({filepath,output});
    } catch(err){
        return res.status(500).json(err)
    }
})

app.listen(5000, () => {
    console.log('server running');
})