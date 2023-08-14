const express = require("express");
const app = express();

const pool = require("./db");

//middlewares
app.use(express.json());


//Creating Test table
async function createTable() {
    try {
        const query = `
        CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        firstname VARCHAR(255),
        lastname VARCHAR(255)
        );
      `;

        const client = await pool.connect();
        await client.query(query);
        client.release();
        console.log('Users table created or already exists');
    } catch (error) {
        const errorMessage = error.message.split('\n')[0];
        console.error('Error creating table:', errorMessage);
    }
}

//Routes
app.post("/api/test", async (req, res) => {
    try {
        const { firstname, lastname } = req.body;
        const client = await pool.connect();
        const query = `
          INSERT INTO users (firstname, lastname)
          VALUES ($1, $2)
          RETURNING user_id;
        `;
        const values = [firstname, lastname];
        const result = await client.query(query, values);
        const user_id = result.rows[0].user_id;
        client.release();

        res.status(201).json({ message: 'User data submitted successfully', user_id });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

app.listen(5000, () => {
    createTable();
    console.log("Server started");
});
