import { Express, Request, Response } from "express";
import { systemConfig } from "./config/system.config";
import * as database from "./config/database.config";
import express from "express";
import dotenv from "dotenv";
import flash from "express-flash";
import cookieParser from "cookie-parser";
import session from "express-session";
import methodOverride from "method-override";
import path from "path";
import adminRoutes from "./routes/admin/index.route";
import clientsRoutes from "./routes/clients/index.route";

const app: Express = express();

// dotenv
dotenv.config();

// database
database.connect();

// public files
app.use("/public", express.static(path.join(__dirname, "public")));

// flash
app.use(cookieParser("TPT"));
app.use(
  session({
    secret: "TPT", // Ensure this secret matches your use case
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);
app.use(flash());

// body-parser
app.use(express.urlencoded({ extended: true }));

// method-override
app.use(methodOverride("_method"));

// views
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// tinymce
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// app locals
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// routes
adminRoutes(app);
clientsRoutes(app);
app.use("*", (req: Request, res: Response) => {
  res.render("not-found.pug");
});

// port
const port: number | string = process.env.PORT;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
