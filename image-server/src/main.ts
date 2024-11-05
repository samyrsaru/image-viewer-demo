import { buildSchema } from "graphql";

import express from "express";
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import { corsOptions } from "./cors.options.js";
import { getImages } from "./images.service.js";

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
    type Query {
      images: [Image]
    }
    type Image {
      name: String
      url: String
    }
  `);

// The root provides a resolver function for each API endpoint
const root = {
  async images() {
    return getImages();
  },
};

const app = express();
app.use(cors(corsOptions));

// Create and use the GraphQL handler.
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

const port = 4000;
app.listen(port);
console.log(`Running a GraphQL API server at http://localhost:${port}/graphql`);
