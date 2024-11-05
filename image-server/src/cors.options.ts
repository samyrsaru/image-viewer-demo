import { CorsOptions } from "cors";

const whitelist = ["http://localhost:5173"];

export const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (whitelist.includes(requestOrigin ?? "")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
