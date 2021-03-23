// Global variables and required packages
const express = require('express');
const path = require('path')
const fs = require('fs');
const app = express();
var PORT = process.env.PORT || 8080;
const { v4: uuidv4 } = require('uuid');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Enables css and js to link on html files in public folder
app.use(express.static('public'));

// HTTP Routes
// create path to dbjs.on on the back end that will be used to store and retrieve notes using the `fs` module
const dbPath = path.join(__dirname, 'db/db.json')

// GET requests
// `GET /notes` should return the `notes.html` file.
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// `GET *` should return the `index.html` file.
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    // Read the db.json file
    let noteArray = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    // Assign an id value to each item in noteArray
    noteArray.forEach((note, index) => {
        note.id = index + 1;
    });
    // Return saved notes as json
    return res.json(noteArray);
});

// POST requests
// * `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post('/api/notes', (req, res) => {
    // req.body hosts is equal to the JSON post sent from the user. This works because of our body-parsing middleware
    // Read all of the existing notes
    var existingNotes = fs.readFileSync('./db/db.json', 'utf8');

    // Convert string into JSON object
    let allNotes = JSON.parse(existingNotes);

    let newNote = req.body;
    // Assign a unique ID to each note in db.json using the uuid package
    newNote.id = uuidv4();
    // Add the new note to the existingNotes array
    allNotes.push(newNote);
    console.log(allNotes);
    // Stringify object so writeFileSync can read it
    fs.writeFileSync('./db/db.json', JSON.stringify(allNotes));
    res.json(req.body);
});

// DELETE request
app.delete('/api/notes/:id', (req, res) => {
    // Get the id of the note to delete
    const id = req.params.id;
    console.log(req.params.id);
    // Get the array of notes from db.json and convert string to JSON object
    var existingNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    // Filter notes that do NOT match the id above into a new array
    const savedNotes = existingNotes.filter(note => note.id !== id);
    console.log(savedNotes);
    // Stringify object so writeFileSync can read it
    // Overwrite db.json with the new array, not including the deleted note.
    fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes));
    // Tell the user a note was deleted
    res.status(200).json({ message: "1 entry deleted." })
});

app.listen(PORT, () => console.log(`Listening at port http://localhost:${PORT}`));