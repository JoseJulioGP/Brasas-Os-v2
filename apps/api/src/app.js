const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const { auditMiddleware } = require("./shared/middlewares/audit.middleware");
const app = express();

app.use(helmet());
app.use(express.json());

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://tudominio.com"
      : "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(auditMiddleware);

app.use("/api/v1/auth",       require("./features/auth/routes"));
app.use("/api/v1/usuarios",   require("./features/users/users.routes"));
app.use("/api/v1/productos",  require("./features/productos/productos.routes"));
app.use("/api/v1/inventario", require("./features/inventario/inventario.routes"));
app.use("/api/v1/pedidos",    require("./features/pedidos/pedidos.routes"));
app.use("/api/v1/reportes",   require("./features/reportes/reportes.routes"));
app.use("/api/v1/historial",  require("./features/historial/historial.routes"));

module.exports = app;