// The application should have a `db.json` file on the back end that will be used to store and retrieve notes using the `fs` module.
const express = require('express');
const path = require('path')
const fs = require('fs');
const app = express();
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static('public'));


// The following HTML routes should be created:
// create path to dbjson
const dbPath = path.join(__dirname, 'db/db.json')

// GET requests
// `GET /notes` should return the `notes.html` file.
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// `GET *` should return the `index.html` file.
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    // read the db.json file
    let noteArray = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    // assign an id value to each item in noteArray
    noteArray.forEach((note, index) => {
        note.id = index + 1;
    })
    //return saved notes as json
    return res.json(noteArray);
});

// POST requests
// * `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into `npm` packages that could do this for you).
app.post('/api/notes', (req, res) => {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    // read all of the existing notes
    var existingNotes = fs.readFileSync('./db/db.json', 'utf8');

    // convert string into JSON object
    let allNotes = JSON.parse(existingNotes);


    // add the new note to the existingNotes array
    allNotes.push(req.body);
    console.log(allNotes);
    // if the array is not null (empty) assign each note a unique id
    if (!allNotes) {
        // assign id based on index and array length
        allNotes[allNotes.length].id = allNotes.length;
    };

    // stringify object so writefile can read it
    fs.writeFileSync('./db/db.json', JSON.stringify(allNotes));

    res.json(req.body);
});

// app.put('/api/notes/:id', (req, res) => {
//     const { author, value } = req.body;
//     // change a note --- which note?
//     // re.params.id (/notes/:id)
//     // req.query.id (/notes?id=)
//     // no identifier changes all the notes
// });

// app.delete('/api/notes/:id', (req, res) => {
//     const { author, value } = req.body;
//     // delete a note --- which note?
//     // re.params.id (/notes/:id)
//     // req.query.id (/notes?id=)
//     // no identifier deletes all the notes
//     res.status(200).json({ message: "1 entry deleted." })
// });

app.listen(PORT, () => console.log(`Listening at port http://localhost:${PORT}`));