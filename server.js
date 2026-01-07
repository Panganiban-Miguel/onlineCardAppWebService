const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000

// Database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    WaitForConnections: true,
    connectionlimit: 100,
    queueLimit: 0
};

// initialize express app
const app = express();
// allows app to read JSON
app.use(express.json());

// Example route: Get all cards
app.get('/allcards', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.cards');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({message: 'Server Error for allcards'});
    }
});

// Example Route: Create a new card
app.post('/addcard', async (req, res) => {
    const{card_name, card_pic} = req.body;
    try{
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO cards (card_name, card_pic) VALUES (?, ?)',
            [card_name, card_pic]
        )
        res.status(201).json({message: `Card ${card_name} added successfully`});
    } catch (err) {
        console.error(err);
        res.status(201).send({message: `Server error - could not add ${card_name}`});
    }
});

app.listen(port, () => {
    console.log(`Server is running on port https://localhost:${port}`);
})