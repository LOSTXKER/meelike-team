/**
 * All MSW handlers combined
 */

import { authHandlers } from "./auth";
import { sellerHandlers } from "./seller";
import { workerHandlers } from "./worker";
import { hubHandlers } from "./hub";
import { teamHandlers } from "./team";

export const handlers = [
  ...authHandlers,
  ...sellerHandlers,
  ...workerHandlers,
  ...hubHandlers,
  ...teamHandlers,
];
