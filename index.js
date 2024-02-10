const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/", routes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Hubo un error en el servidor" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
