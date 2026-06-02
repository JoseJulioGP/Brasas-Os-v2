const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const { auditMiddleware } = require("./shared/middlewares/audit.middleware");
const swaggerUi   = require("swagger-ui-express");
const swaggerSpec = require("./shared/swagger/swagger");
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

// Swagger UI — equivalente al Swagger de .NET en Visual Studio
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "Brasas OS API",
  swaggerOptions: {
    persistAuthorization: true,
    tryItOutEnabled: true,
    docExpansion: "none",
    filter: true,
    tagsSorter: (a, b) => {
      if (a === "Auth") return -1;
      if (b === "Auth") return 1;
      return a.localeCompare(b);
    },
  },
}));

app.use("/api/v1/auth",       require("./features/auth/routes"));
app.use("/api/v1/usuarios",   require("./features/users/users.routes"));
app.use("/api/v1/productos",  require("./features/productos/productos.routes"));
app.use("/api/v1/inventario", require("./features/inventario/inventario.routes"));
app.use("/api/v1/pedidos",    require("./features/pedidos/pedidos.routes"));
app.use("/api/v1/reportes",   require("./features/reportes/reportes.routes"));
app.use("/api/v1/historial",  require("./features/historial/historial.routes"));

module.exports = app;