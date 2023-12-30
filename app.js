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
            res.json(data);
        });
});

app.listen(expressPort, () => {
    console.log(`Listening on port ${expressPort}...`);
})