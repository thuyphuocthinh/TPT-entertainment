import { Express } from "express";
import { homepageRoutes } from "./homepage.route";
import { searchRoutes } from "./search.route";
import { usersRoutes } from "./users.route";
// middleware
import * as userMiddlewares from "../../middlewares/clients/userMiddleware.middleware";

const clientsRoutes = (app: Express) => {
  app.use("/", userMiddlewares.userMiddleware, homepageRoutes);
  app.use("/search", userMiddlewares.userMiddleware, searchRoutes);
  app.use("/auth", usersRoutes);
};

export default clientsRoutes;
