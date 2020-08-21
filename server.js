// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs=require("fs");
const { v4: uuidv4 } = require('uuid');

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

const OUTPUT_DIR = path.resolve(__dirname, "db");
const outputPath = path.join(OUTPUT_DIR, "db.json");


app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
  
// Sets up the Express app to handle data parsing
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname, "./public/index.html"));
})
app.get("/notes", function(req,res){
    res.sendFile(path.join(__dirname, "./public/notes.html"));
})

app.get("/api/notes", function(req, res) {
    fs.readFile(path.join(__dirname, "./db/db.json"),(err, data) => {
        if (err) throw err; 
        // console.log(data);
        let noteArray=JSON.parse(data);
        return res.json(noteArray);
    });
    
});
app.post("/api/notes", function(req, res) {
    let activeNote=req.body;
    activeNote.id=uuidv4();
    fs.readFile(path.join(__dirname, "./db/db.json"),(err, data) => {
        if (err) throw err; 
        // console.log(data);
        let noteArray=JSON.parse(data);
        noteArray.push(activeNote);
        fs.writeFile(outputPath, JSON.stringify(noteArray), (err) => {
            if (err) throw err;
            res.redirect("/notes");
        });
    });
    
});
app.delete("/api/notes/:id", function(req, res) {
    let id=req.params.id;
    fs.readFile(path.join(__dirname, "./db/db.json"),(err, data) => {
        if (err) throw err; 
        // console.log(data);
        let noteArray=JSON.parse(data);
        let newArray= noteArray.filter((note)=>{
            return note.id!==id;
        }) ;
        console.log("test" +newArray)
        fs.writeFile(outputPath, JSON.stringify(newArray), (err) => {
            if (err) throw err;
            res.sendFile(path.join(__dirname, "./public/notes.html"));
        });
    });
});

app.get("/*", function(req,res){
    res.sendFile(path.join(__dirname, "./public/index.html"));
})
