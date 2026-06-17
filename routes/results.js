const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/', (req, res) => {
  const { student_id, subject, marks_obtained, total_marks, exam_date } = req.body;
  if (!student_id || !subject || !marks_obtained || !total_marks || !exam_date)
    return res.status(400).json({ error: 'All fields required' });
  db.query(
    'INSERT INTO results (student_id, subject, marks_obtained, total_marks, exam_date) VALUES (?, ?, ?, ?, ?)',
    [student_id, subject, marks_obtained, total_marks, exam_date],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Result added!', id: result.insertId });
    }
  );
});

router.get('/:studentId', (req, res) => {
  const query = `
    SELECT r.*, s.name, s.roll_no, s.class
    FROM results r
    JOIN students s ON r.student_id = s.id
    WHERE r.student_id = ?
    ORDER BY r.exam_date DESC
  `;
  db.query(query, [req.params.studentId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get('/', (req, res) => {
  const query = `
    SELECT r.*, s.name, s.roll_no, s.class
    FROM results r
    JOIN students s ON r.student_id = s.id
    ORDER BY r.exam_date DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;