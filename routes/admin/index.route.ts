import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { songsRoutes } from "./songs.route";
import { systemConfig } from "../../config/system.config";
import { topicsRoutes } from "./topics.route";

const adminRoutes = (app: Express) => {
  app.use(`${systemConfig.prefixAdmin}/`, dashboardRoutes);
  app.use(`${systemConfig.prefixAdmin}/songs`, songsRoutes);
  app.use(`${systemConfig.prefixAdmin}/topics`, topicsRoutes);
};

export default adminRoutes;
