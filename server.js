const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});

const jsonData = fs.readFileSync("./db/db.json");
const parsedNote = JSON.parse(jsonData);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        const readNotes = JSON.parse(data)
        // console.log(readNotes);
        return res.json(readNotes);
    });
});

app.get("/api/notes/:id", (req, res) => {
    const id = req.params.id;

    // console.log(`note in the :id thing: ${jsonData}`);

    for (let i = 0; i < parsedNote.length; i++) {
        if (id === parsedNote[i].id) {
            return res.json(parsedNote[i]);
        }
    }
})

app.post("/api/notes", (req, res) => {
    const newNote = req.body;

    newNote.id = newNote.title.replace(/\s+/g, "").toLowerCase();
    newNote.id = newNote.id + Math.floor(Math.random() * 1000);
    // console.log(newNote.id);
    res.json(true);

    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        let note = JSON.parse(data);
        note.push(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(note), "utf8", (err) => {
            if (err) throw err;
            console.log(`success?`)
        });
    })

});

app.delete("/api/notes/:id", (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        const parsedNote = JSON.parse(data);
        let deleteId = req.params.id;
        console.log(`response: ${data}`)
        console.log(`ID to be deleted: ${deleteId}`)
        let deleteObj = parsedNote.find(data => data.id == deleteId);
        let deleteIndex = parsedNote.indexOf(deleteObj);
        parsedNote.splice(deleteIndex, 1);
        res.send(deleteObj);

        fs.writeFile("./db/db.json", JSON.stringify(parsedNote), err => {
            if (err) throw err;
            console.log("did it work? who knows!")
        })
    })
})