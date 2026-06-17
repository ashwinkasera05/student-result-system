const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', (req, res) => {
  db.query('SELECT * FROM students ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { name, roll_no, class: cls } = req.body;
  if (!name || !roll_no || !cls)
    return res.status(400).json({ error: 'All fields required' });
  db.query(
    'INSERT INTO students (name, roll_no, class) VALUES (?, ?, ?)',
    [name, roll_no, cls],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Student added!', id: result.insertId });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.query('DELETE FROM students WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Student deleted!' });
  });
});

module.exports = router;