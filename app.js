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

//get route to show data
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

//post route to add data
app.post("/exercise", (req, res) => {
    const { username, workout, duration, date } = req.body;

    pool.query(
        `INSERT INTO users (username) VALUES ($1) ON CONFLICT DO NOTHING`,
        [username]
    )
    .then(() => {
        return pool.query(
            `INSERT INTO workouts (name, duration, date, id) VALUES ($1, $2, $3, 
                (SELECT id FROM users WHERE username = $4)) RETURNING *`,
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

//patch route to update workout data
app.patch("/exercise/:id", (req, res) => {
    const { workout, duration, date } = req.body;
    const workoutId = req.params.id;

    pool.query(
        `UPDATE workouts SET name = $1, duration = $2, date = $3 WHERE workout_id = $4 RETURNING *`,
        [workout, duration, date, workoutId]
    )
    .then((data) => {
        if (data.rows.length === 0) {
            return res.status(404).json({ error: "Workout not found" });
        }
        res.json(data.rows[0]);
    })
    .catch((error) => {
        console.error("Error updating exercise: ", error);
        res.status (500).send("Internal Server Error");
    })
})

//delete route to delete workout data
app.delete("/exercise/:id", (req, res) => {
    const workoutId = parseInt(req.params.id);

    // Validate that workoutId is a valid integer
    if (isNaN(workoutId)) {
        return res.status(400).json({ error: "Invalid workoutId" });
    }
    
    pool.query(
        `DELETE FROM workouts WHERE workout_id = $1 RETURNING *`, 
        [workoutId]
        )
        
        .then((data) => {
            if (data.rows.length === 0) {
                return res.status(404).json({ error: "Workout not found" });
            }
            res.json({ message: "Workout deleted succesfully" });
        })
        .catch((error) => {
            console.error("Error deleting exercise: ", error);
            res.status(500).send("Internal Server Error");
    })
})

app.listen(expressPort, () => {
    console.log(`Listening on port ${expressPort}...`);
})