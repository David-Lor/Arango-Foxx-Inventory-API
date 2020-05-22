/**
 * https://www.arangodb.com/docs/stable/foxx-getting-started.html
 */

"use strict";
const createRouter = require("@arangodb/foxx/router");
const { setRoutes } = require("./src/routes.js");

const router = createRouter();
setRoutes(router);

module.context.use(router);
