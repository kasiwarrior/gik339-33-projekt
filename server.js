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

server.get("/books", (req, res) => {
  const sql = "SELECT * FROM books";

    db.all(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
      });
});

server.post("/books", (req, res) => {
    const {title, author, isbn, category } = req.body;

    console.log(`${title} ${author} ${isbn} ${category}`)
})