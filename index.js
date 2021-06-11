const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const pagueRouter = require("./routes/pagueServer");

const PORT = process.env.PORT || 8080;

const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("pagueDB.json");
const db = low(adapter);

db.defaults({ cliente: [] }).write();

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API Pague Direto",
			version: "1.0.0",
			description: "API criada para dar suporte as aplicações da Pague Direto.",
		},
		servers: [
			{
				url: "http://localhost:8080",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/negotiation", pagueRouter);

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
