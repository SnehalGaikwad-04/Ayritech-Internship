const express = require("express");
const db = require("./database.js");
const router = express.Router();

// Get existing templates
router.get("/templates", (req, res) => {
  db.query("SELECT * FROM templates", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get existing designs
router.get("/designs", (req, res) => {
  db.query("SELECT * FROM designs", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Save new or edited template
router.post("/save-template", (req, res) => {
  const { user_id, template_name, template_data } = req.body;
  db.query(
    "INSERT INTO templates (user_id, template_name, template_data) VALUES (?, ?, ?)",
    [user_id, template_name, template_data],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Template saved successfully", id: result.insertId });
    }
  );
});

// Save new or edited design
router.post("/save-design", (req, res) => {
  const { user_id, design_name, design_data } = req.body;
  db.query(
    "INSERT INTO designs (user_id, design_name, design_data) VALUES (?, ?, ?)",
    [user_id, design_name, design_data],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Design saved successfully", id: result.insertId });
    }
  );
});

module.exports = router;
