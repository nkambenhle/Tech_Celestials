const express = require('express');
const { connectToDb, getDb } = require('./db');

// Initialize app & middleware
const app = express();

// DB connection
let db;

connectToDb((err) => {  // Added 'err' parameter to the callback
    if (!err) {
        app.listen(3000, () => {
            console.log('App listening on port 3000');
        });
        db = getDb();
    } else {
        console.error('Failed to connect to the database:', err);
    }
});

// Routes
app.get('/User', (req, res) => {
    let users = [];

    db.collection('User')
        .find() // Cursor
        .sort({ Username: 1 })
        .forEach(User => users.push(User))
        .then(() => {
            console.log('Users:', users); // Log the retrieved users
            res.status(200).json(users);
        })
        .catch((err) => {
            console.error('Error fetching documents:', err); // Log any errors
            res.status(500).json({ error: 'Could not fetch the documents' });
        });
});

