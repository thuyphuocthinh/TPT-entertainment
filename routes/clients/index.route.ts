import { Express } from "express";
import { homepageRoutes } from "./homepage.route";
import { searchRoutes } from "./search.route";
import { usersRoutes } from "./users.route";
// middleware
import * as userMiddlewares from "../../middlewares/clients/userMiddleware.middleware";
import { songsRoutes } from "./songs.route";

const clientsRoutes = (app: Express) => {
  app.use("/", userMiddlewares.userMiddleware, homepageRoutes);
  app.use("/search", userMiddlewares.userMiddleware, searchRoutes);
  app.use("/songs", userMiddlewares.userMiddleware, songsRoutes);
  app.use("/auth", usersRoutes);
};

export default clientsRoutes;
