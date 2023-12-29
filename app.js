const express = require('express');
const pg = require('pg');

import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;
const expressPort = 8004;

const connectionString = process.allowedNodeEnvironmentFlags.PG_DATABASE_URL

const pool = new Pool ({
    connectionString,
});

app.use(express.static('public'));
app.use(express.json());

app.listen(expressPort, () => {
    console.log(`Listening on port ${expressPort}...`);
})