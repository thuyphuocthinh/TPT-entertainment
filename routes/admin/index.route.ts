import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { songsRoutes } from "./songs.route";
import { systemConfig } from "../../config/system.config";

const adminRoutes = (app: Express) => {
  app.use(`${systemConfig.prefixAdmin}/`, dashboardRoutes);
  app.use(`${systemConfig.prefixAdmin}/songs`, songsRoutes);
};

export default adminRoutes;
