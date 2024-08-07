import { Express } from "express";
import { homepageRoutes } from "./homepage.route";
import { searchRoutes } from "./search.route";
import { authRoutes } from "./auth.route";
import { usersRoutes } from "./users.route";
import { singersRoutes } from "./singers.route";
import { songsRoutes } from "./songs.route";
import { topicsRoutes } from "./topics.route";
import { rankingRoutes } from "./ranking.route";
// middleware
import * as userMiddlewares from "../../middlewares/clients/userMiddleware.middleware";

const clientsRoutes = (app: Express) => {
  app.use("/", userMiddlewares.userMiddleware, homepageRoutes);
  app.use("/search", userMiddlewares.userMiddleware, searchRoutes);
  app.use("/songs", userMiddlewares.userMiddleware, songsRoutes);
  app.use("/singers", userMiddlewares.userMiddleware, singersRoutes);
  app.use("/topics", userMiddlewares.userMiddleware, topicsRoutes);
  app.use("/ranking", userMiddlewares.userMiddleware, rankingRoutes);
  app.use("/users", userMiddlewares.userMiddleware, usersRoutes);
  app.use("/auth", authRoutes);
};

export default clientsRoutes;
