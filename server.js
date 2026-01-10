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


// Route: Get all games
app.get('/allgames', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.games');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({message: 'Server Error for allgames'});
    }
});


// Route: Update a game
app.post('/updategame', async (req, res) => {
    const { game_id, game, game_link, game_img } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);

        const [result] = await connection.execute(
            'UPDATE games SET game = ?, game_link = ?, game_img = ? WHERE game_id = ?',
            [game, game_link, game_img, game_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `${game} not found` });
        }

        res.json({ message: `${game} updated successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for updategame' });
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

// Route: Create a new game
app.post('/addgame', async (req, res) => {
    const{game, game_link, game_img} = req.body;
    try{
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO games (game, game_link, game_img) VALUES (?, ?, ?)',
            [game, game_link, game_img]
        )
        res.status(201).json({message: `${game} added successfully`});
    } catch (err) {
        console.error(err);
        res.status(201).send({message: `Server error - could not add ${game}`});
    }
});


// Route: Delete a game
app.post('/deletegame', async (req, res) => {
    const { game_id } = req.body;

    try {
        let connection = await mysql.createConnection(dbConfig);

        const [result] = await connection.execute(
            'DELETE FROM games WHERE game_id = ?',
            [game_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `${game} not found` });
        }

        res.status(200).json({ message: `${game} deleted successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: `Server error - could not delete ${game}` });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port https://localhost:${port}`);
})