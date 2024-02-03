const fs = require("fs").promises;
const express = require("express");

const app = express();

const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use(express.json());

app.post("/updateNumber", async (req, res) => {
  const updatedNumberValue = req.body.numberValue;
  await writeNumberData(updatedNumberValue);
  res.send("Number value updated successfully");
});

app.post("/saveNote", async (req, res) => {
  const newNote = req.body.note;
  await saveNoteData(newNote);
  res.send("Note saved successfully");
});

async function writeNumberData(numberValue) {
  try {
    const data = await readData();
    data.numberValue = numberValue;
    await fs.writeFile("data.json", JSON.stringify(data), "utf-8");
    console.log("Number value updated successfully", data.numberValue);
  } catch (error) {
    console.error("Error updating number value:", error);
  }
}

async function saveNoteData(note) {
  try {
    const data = await readData();
    if (!data.notes) {
      data.notes = [];
    }
    const newNote = {
      id: data.numberValue,
      timestamp: new Date().toISOString(),
      content: note,
    };
    data.notes.push(newNote);
    await fs.writeFile("data.json", JSON.stringify(data), "utf-8");
    console.log("Note saved successfully", newNote);
  } catch (error) {
    console.error("Error saving note:", error);
  }
}

app.get("/getdata", async (req, res) => {
  const data = await readData();
  res.json(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function readData() {
  try {
    const data = await fs.readFile("data.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return null;
  }
}
