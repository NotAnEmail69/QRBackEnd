const express = require("express");
const cors = require("cors");
const fs = require("fs");
const QRCode = require("qrcode");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = "vehiculos.json";

// Función para leer JSON
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) return {};
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(raw || "{}");
};

// Función para escribir JSON
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Contador para generar ID
let counter = Object.keys(readData()).length + 1;

// Guardar vehículo y generar QR
app.post("/api/vehiculos", async (req, res) => {
  try {
    const id = counter++;
    const data = readData();
    data[id] = req.body;
    writeData(data);
    res.status(201).json({
      id,
      ...req.body,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar vehículo" });
  }
});

// Obtener datos por ID
app.get("/api/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();
  if (!data[id])
    return res.status(404).json({ error: "Vehículo no encontrado" });

  res.json({ id, ...data[id] });
});

app.listen(4000, () => console.log("✅ Backend en http://localhost:4000"));
