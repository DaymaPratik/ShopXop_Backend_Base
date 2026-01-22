
import dotenv from "dotenv";
dotenv.config();

import { PORT } from "./core/config";
import { App } from "./app";
import { UserController } from "./controller/UserController";
import { SecurityController } from "./controller/SecurityController";
import { APP_ROUTES } from "./core/AppRoutes";
import { OrderController } from "./controller/OrderController";

(async function bootstrap() {
  try {
    const app = new App(PORT);

    await app.init([
      new UserController(APP_ROUTES.USER),
      new SecurityController(),
      new OrderController(APP_ROUTES.ORDERS),
    ]);

    app.listen();
  } catch (error) {
    console.error("❌ Error initializing the app:", error);
    process.exit(1);
  }
})();
