// The application should have a `db.json` file on the back end that will be used to store and retrieve notes using the `fs` module.
const express = require('express');
const path = require('path')
var PORT = process.env.PORT || 3000;

const app = express();

// The following HTML routes should be created:
const notes = [];
// `GET /notes` should return the `notes.html` file.
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// `GET *` should return the `index.html` file.
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => res.json(notes));
// * `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into `npm` packages that could do this for you).
app.post('/api/notes', (req, res) => {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    const newNote = req.body;

    // Using a RegEx Pattern to remove spaces from newCharacter
    // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
    newNote.routeName = newNote.name.replace(/\s+/g, '').toLowerCase();
    console.log(newNote);

    note.push(newNote);
    res.json(newNote);
});

app.listen(PORT, () => console.log(`Listening at port http://localhost:${PORT}`));