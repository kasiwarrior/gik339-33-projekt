const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./gik339-33-projekt.db');

db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    date TEXT,
    color TEXT
)`);

const PORT = process.env.PORT || 3000;
const express = require("express");
const server = express();
server.listen(PORT, () => {});
server.use(express.json());

console.log("Hello!");