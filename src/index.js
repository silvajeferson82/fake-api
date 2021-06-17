require('dotenv/config');
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const pagueRouter = require("../src/routes/pagueServer");



const PORT = process.env.PORT;

const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("./src/pagueDB.json");
const db = low(adapter);

db.defaults({ debitos:[] }).write();

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API Pague Direto",
			version: "1.0.0",
			description: "API criada para dar suporte as aplicações da Pague Direto.",
		},
	},
	apis: ["./src/routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/debitos", pagueRouter);

app.listen(PORT);
