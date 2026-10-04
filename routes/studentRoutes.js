const express = require("express");
const router = express.Router();
const students = require("../data/students");


const validateStudent = (body) => {
  const { name, age, course } = body || {};
  if (typeof name !== "string" || name.trim() === "") {
    return "Name is required and must be a non-empty string";
  }
  if (!Number.isInteger(age) || age <= 0) {
    return "Age is required and must be a positive integer";
  }
  if (typeof course !== "string" || course.trim() === "") {
    return "Course is required and must be a non-empty string";
  }
  return null;
};

const findIndexById = (idParam) => {
  const id = Number(idParam);
  if (!Number.isInteger(id)) return { id: null, index: -1 };
  return { id, index: students.findIndex((s) => s.id === id) };
};


router.get("/", (req, res) => {
  res.status(200).json(students);
});


router.get("/:id", (req, res) => {
  const { id, index } = findIndexById(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Student ID must be a number" });
  }
  if (index === -1) {
    return res.status(404).json({ error: `Student with id ${id} not found` });
  }
  res.status(200).json(students[index]);
});

router.post("/", (req, res) => {
  const error = validateStudent(req.body);
  if (error) return res.status(400).json({ error });

  const nextId = students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1;
  const newStudent = {
    id: nextId,
    name: req.body.name.trim(),
    age: req.body.age,
    course: req.body.course.trim(),
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

router.put("/:id", (req, res) => {
  const { id, index } = findIndexById(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Student ID must be a number" });
  }
  if (index === -1) {
    return res.status(404).json({ error: `Student with id ${id} not found` });
  }

  const error = validateStudent(req.body);
  if (error) return res.status(400).json({ error });

  students[index] = {
    id,
    name: req.body.name.trim(),
    age: req.body.age,
    course: req.body.course.trim(),
  };
  res.status(200).json(students[index]);
});

router.delete("/:id", (req, res) => {
  const { id, index } = findIndexById(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Student ID must be a number" });
  }
  if (index === -1) {
    return res.status(404).json({ error: `Student with id ${id} not found` });
  }

  const [deleted] = students.splice(index, 1);
  res.status(200).json({ message: "Student deleted successfully", student: deleted });
});

module.exports = router;