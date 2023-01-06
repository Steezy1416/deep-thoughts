const express = require('express');
const {authMiddleware} = require("./utils/auth")

//import apollo server and typeDefs and resolvers
const {ApolloServer} = require("apollo-server-express")
const {typeDefs, resolvers} = require("./schemas")

const db = require('./config/connection');

const PORT = process.env.PORT || 3001;

//create apollo server and pass schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
})

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//create instance of apollo server with graphql schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start()

  //integrate apollo server with the express application as middleware
  server.applyMiddleware({app})
}

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);

    console.log(`Use GraphQl at http://localhost:${PORT}${server.graphqlPath}`)
  });
});

//call async functions to start the server
startApolloServer(typeDefs, resolvers)
