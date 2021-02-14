const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const { resolve } = require("path");

const path = resolve(__dirname, "..", "schema", "graph.graphql");

const typeDefs = fs.readFileSync(path, { encoding: "utf8", });

var _id = 0;
var photos = [
  {
    id: "1",
    name: " name1",
    description: "desc1",
    category: "ACTION",
    githubUser: "gPlake",
  },
  {
    id: "2",
    name: " name2",
    description: "desc2",
    category: "SELFIE",
    githubUser: "sSchmidt",
  },
  {
    id: "3",
    name: " name1",
    description: "desc1",
    category: "LANDSCAPE",
    githubUser: "sSchmidt",
  },
];

var users = [
  {
    githubLogin: "mHattrup",
    name: "Mike Hattrup",
  },
  {
    githubLogin: "gPlake",
    name: "Glen Plake",
  },
  {
    githubLogin: "sSchmidt",
    name: "Scot Schmidt",
  },
];

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
  },
  Mutation: {
    postPhoto(parent, args) {
      var newPhoto = {
        id: _id++,
        ...args.input,
      };
      photos.push(newPhoto);
      return newPhoto;
    },
  },
  Photo: {
    url: (parent) => `https://yoursite.com/img/${parent.id}.jpg`,
    postedBy: (parent) => {
      return users.find((u) => u.githubLogin === parent.githubUser);
    },
  },
  User: {
    postedPhotos: (parent) => {
      return photos.filter((p) => p.githubUser === parent.githubLogin);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`));