require("dotenv").config();

const { ApolloServer, gql } = require("apollo-server");
const jwt = require("jsonwebtoken");
const typeDefs = require("./db/Schema");
const resolvers = require("./db/Resolvers");

require("./db/database");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers["authorization"] || "";
    if (token) {
      try {
        console.log(token);
        const user = await jwt.verify(token, process.env.SECRET);
        return {
          user,
        };
      } catch (error) {
        console.log(error);
      }
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Servidor escuchando en ${url}`);
});
