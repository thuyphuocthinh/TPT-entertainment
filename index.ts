import { Express } from "express";
import { systemConfig } from "./config/system.config";
import * as database from "./config/database.config";
import express from "express";
import dotenv from "dotenv";
import bodyparser from "body-parser";
import flash from "express-flash";
import cookieParser from "cookie-parser";
import session from "express-session";
import methodOverride from "method-override";
import adminRoutes from "./routes/admin/index.route";

const app: Express = express();

// dotenv
dotenv.config();

// database
database.connect();

// public files
app.use(express.static("public"));

// flash
app.use(cookieParser("TPT"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// body-parser
app.use(bodyparser.urlencoded({ extended: false }));

// method-override
app.use(methodOverride("_method"));

// views
app.set("views", "./views");
app.set("view engine", "pug");

// tinymce

// app locals
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// routes
adminRoutes(app);

// port
const port: number | string = process.env.PORT;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
