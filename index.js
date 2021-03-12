require("dotenv").config();

const { ApolloServer, gql } = require("apollo-server");

const typeDefs = require("./db/Schema");
const resolvers = require("./db/Resolvers");

require("./db/database");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    const miContext = "Hola";
    return {
      miContext,
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`Servidor escuchando en ${url}`);
});
