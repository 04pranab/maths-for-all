import { jsonResponse, handleCorsPreflight, withCors } from "./http.js";

const API_PREFIX = "/api/";
const NOT_READY = {
  error: "not_configured",
  message: "The account and leaderboard service is not connected to a database yet.",
};

export default {
  async fetch(request, env) {
    const cors = handleCorsPreflight(request, env);
    if (cors) return cors;

    const url = new URL(request.url);
    if (url.pathname === "/health" || url.pathname === "/api/health") {
      return withCors(
        jsonResponse({
          status: "ok",
          service: "maths-for-all-api",
          database: "not-configured",
          features: { accounts: false, leaderboards: false },
        }),
        request,
        env,
      );
    }

    if (url.pathname.startsWith(API_PREFIX)) {
      return withCors(jsonResponse(NOT_READY, 503), request, env);
    }

    return withCors(jsonResponse({ error: "not_found" }, 404), request, env);
  },
};

export { jsonResponse };
