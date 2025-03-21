const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Sejal@18", //your db pass
  database: "certificate_db",
});

app.get("/templates", (req, res) => {
  db.query("SELECT * FROM templates WHERE deleted = FALSE", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.get("/designs", (req, res) => {
  db.query("SELECT * FROM designs WHERE deleted = FALSE", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.post("/save-template", (req, res) => {
  const { template_name, template_data } = req.body;
  db.query(
    "INSERT INTO templates (template_name, template_data) VALUES (?, ?)",
    [template_name, template_data],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Template saved!" });
    }
  );
});

app.post("/save-design", (req, res) => {
  const { design_name, design_data } = req.body;
  db.query(
    "INSERT INTO designs (design_name, design_data) VALUES (?, ?)",
    [design_name, design_data],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Design saved!" });
    }
  );
});

app.get("/templates/:id", (req, res) => {
  const templateId = req.params.id;
  db.query(
    "SELECT * FROM templates WHERE id = ?",
    [templateId],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length === 0)
        return res.status(404).send("Template not found");
      res.json(result[0]);
    }
  );
});

app.get("/designs/:id", (req, res) => {
  const designId = req.params.id;
  db.query("SELECT * FROM designs WHERE id = ?", [designId], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send("Design not found");
    res.json(result[0]);
  });
});

//trash functionality
app.delete("/templates/:id", (req, res) => {
  const templateId = req.params.id;

  db.query(
    "UPDATE templates SET deleted = 1 WHERE id = ?",
    [templateId],
    (err, result) => {
      if (err) {
        console.error("SQL Error:", err);
        return res
          .status(500)
          .json({ message: "Internal server error", error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json({ message: "Template moved to trash" });
    }
  );
});

app.delete("/designs/:id", (req, res) => {
  const designId = req.params.id;

  db.query(
    "UPDATE designs SET deleted = 1 WHERE id = ?",
    [designId],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Internal server error", error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Design not found" });
      }

      res.json({ message: "Design moved to trash" });
    }
  );
});

app.get("/trashed-templates", (req, res) => {
  db.query("SELECT * FROM templates WHERE deleted = TRUE", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.get("/trashed-designs", (req, res) => {
  db.query("SELECT * FROM designs WHERE deleted = TRUE", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.put("/restore-template/:id", (req, res) => {
  const templateId = req.params.id;

  db.query(
    "UPDATE templates SET deleted = FALSE WHERE id = ?",
    [templateId],
    (err, result) => {
      if (err) return res.status(500).send(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json({ message: "Template restored successfully" });
    }
  );
});

app.put("/restore-design/:id", (req, res) => {
  const designId = req.params.id;

  db.query(
    "UPDATE designs SET deleted = FALSE WHERE id = ?",
    [designId],
    (err, result) => {
      if (err) return res.status(500).send(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Design not found" });
      }

      res.json({ message: "Design restored successfully" });
    }
  );
});

app.listen(5000, () => console.log("Server running on port 5000"));
