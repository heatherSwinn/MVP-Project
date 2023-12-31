import express from "express";
import pg from "pg";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const { Pool } = pg;
const connectionString = process.env.DATABASE_URL


const pool = new Pool ({
    connectionString,
});
const expressPort = 8004;

app.use(express.static('public'));
app.use(express.json());

app.get("/exercise", (req, res) => {
    pool.query(`SELECT * FROM workouts`)
        .then((data) => {
            res.json(data.rows);
        })
        .catch((error) => {
            console.error("Error fetching exercises: ", error);
            res.status(500).send("Internal Server Error");
        })
});

app.post("/exercise", (req, res) => {
    const { username, workout, duration, date } = req.body;

    pool.query(
        `INSERT INTO users (username) VALUES ($1) ON CONFLICT DO NOTHING`,
        [username]
    )
    .then(() => {
        return pool.query(
            `INSERT INTO workouts (name, duration, date, id) VALUES ($1, $2, $3, 
                SELECT id FROM users WHERE username = $4)) RETURNING *`,
            [workout, duration, date, username]
        );
    })
    .then((data) => {
        res.json(data.rows[0]);
    })
    .catch((error) => {
        console.error("Error inserting exercise: ", error);
        res.status(500).send("Internal Server Error");
    })
})

app.listen(expressPort, () => {
    console.log(`Listening on port ${expressPort}...`);
})