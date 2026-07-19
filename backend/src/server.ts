// load environment variables first so modules (Prisma) can access them
import "./config/env";
import app from "./app";
import { env } from "./config/env";
import logger from "./utils/logger";

app.listen(env.PORT, () => {
  logger.info(`CareerPilot Backend running on http://localhost:${env.PORT}`);
});
