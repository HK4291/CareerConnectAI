import express from "express";
import httpLogger from "./middlewares/logger.middleware";
import errorMiddleware from "./middlewares/error.middleware";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import ApiError from "./utils/ApiError";
import routes from "./routes";

const app = express();

app.use(httpLogger);
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.use(express.json());

app.use("/api", routes);

app.use((_req, _res, next) => {
  next(new ApiError(404, "Route not found"));
});

app.use(errorMiddleware);
export default app;
