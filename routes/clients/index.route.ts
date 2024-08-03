import { Express } from "express";
import { homepageRoutes } from "./homepage.route";

const clientsRoutes = (app: Express) => {
  app.use("/", homepageRoutes);
};

export default clientsRoutes;
