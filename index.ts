import { Express } from "express";
import express from "express";
import dotenv from "dotenv";
import bodyparser from "body-parser";
import * as database from "./config/database.config";
import { systemConfig } from "./config/system.config";

const app: Express = express();

// dotenv
dotenv.config();

// database
database.connect();

// public files
app.use(express.static("/public"));

// body-parser
app.use(bodyparser.urlencoded({ extended: false }));

// views
app.set("views", "./views");
app.set("view engine", "pug");

// tinymce

// app locals
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// port
const port: number | string = process.env.PORT;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
