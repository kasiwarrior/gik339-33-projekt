const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./gik339-33-projekt.db');

db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    isbn TEXT,
    category TEXT
)`);

const PORT = process.env.PORT || 3000;
const express = require("express");
const server = express();
server.use(express.json());
server.use(express.static('public'))
server.listen(PORT, () => {});

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

server.get("/books/:id", (req, res) => {
    const sql = "SELECT * FROM books WHERE id = ?";
    const id = req.params.id

    db.get(sql, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(row);
        }
      });
})

server.delete("/books/:id", (req, res) => {
    const id = req.params.id
    const sql = "DELETE FROM books WHERE id = ?";

    console.log(id)
    db.run(sql, [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        if (this.changes === 0){
          res.status(404).json({message: "Boken hittades inte."})
        } else {
          res.json({message:"Boken har tagits bort"})
        }
      });
})

server.post("/books", (req, res) => {
    const {title, author, isbn, category } = req.body;

    console.log(`${title} ${author} ${isbn} ${category}`)

    const sql = `INSERT INTO books (title, author, isbn, category) VALUES (?, ?, ?, ?)`;
    const params = [author, title, isbn, category]

    db.run(sql, params, function(err) {

    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({
      id: this.lastID,
      title,
      author,
      isbn,
      category
    });
  });
})

server.put("/books", (req, res) => {
      const {title, author, isbn, category, id} = req.body;
      console.log(`${title} ${author} ${isbn} ${category}, ${id}`)

      const sql = `UPDATE books SET title = ?, author = ?, isbn = ?, category = ? WHERE id = ?`
      params = [title, author, isbn, category, id]

    db.run(sql, params, function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({
      id: this.lastID,
      title,
      author,
      isbn,
      category
    });
  });
})