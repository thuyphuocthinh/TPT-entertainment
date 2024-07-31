import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { songsRoutes } from "./songs.route";
import { systemConfig } from "../../config/system.config";
import { topicsRoutes } from "./topics.route";
import { singersRoutes } from "./singers.route";

const adminRoutes = (app: Express) => {
  app.use(`${systemConfig.prefixAdmin}/`, dashboardRoutes);
  app.use(`${systemConfig.prefixAdmin}/songs`, songsRoutes);
  app.use(`${systemConfig.prefixAdmin}/topics`, topicsRoutes);
  app.use(`${systemConfig.prefixAdmin}/singers`, singersRoutes);
};

export default adminRoutes;
