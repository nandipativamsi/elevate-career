require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const app = express();
const port = 3000;
const URI = process.env.MONGODB_URI;


app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, World!!');
});

const GraphQLDate = new GraphQLScalarType({
  name: 'GraphQLDate',
  description: 'A Date() type in GraphQL as a scalar',
  serialize(value) {
      return value.toISOString();
  },
  parseValue(value) {
      const dateValue = new Date(value);
      return isNaN(dateValue) ? undefined : dateValue;
  },
  parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
          const value = new Date(ast.value);
          return isNaN(value) ? undefined : value;
      }
  },
});

let database, JobsCollection, EventsCollection, ResourcesCollection;

(async () => {
  
  try {
    const client = new MongoClient(URI);
    await client.connect();
    console.log('Database connected');
    database = client.db('Capstone');
    JobsCollection = database.collection('Jobs');
    EventsCollection = database.collection('Events');
    ResourcesCollection = database.collection('Resources');

    
    const eventTypeDefs = fs.readFileSync('./models/EventSchema.graphql', 'utf-8');
    const jobTypeDefs = fs.readFileSync('./models/JobSchema.graphql', 'utf-8');
    const resourceTypeDefs = fs.readFileSync('./models/ResourceSchema.graphql', 'utf-8');
    const typeDefs = [eventTypeDefs, jobTypeDefs, resourceTypeDefs].join('\n');

    const resolvers = {
      Query: {
        jobList: async () => {
          const jobs = await JobsCollection.find({}).toArray();
          return jobs;
        },
        eventList: async () => {
          const events = await EventsCollection.find({}).toArray();
          return events;
        },
        resourceList: async () => {
          const resources = await ResourcesCollection.find({}).toArray();
          return resources;
        },
      },
      Mutation: {
        addJob: async (_, { job }) => {
          validateJob(job);
          job._id = new ObjectId();
          job.postedBy = "Smeet";
          job.applications = "0";
          await JobsCollection.insertOne(job);
          return job;
        },
        addEvent: async (_, { event }) => {
          validateEvent(event);
          //console.log(event);
          event._id = new ObjectId();
          event.attendees = "0";
          event.postedBy = "Smeet";
          await EventsCollection.insertOne(event);
          return event;
        },
        addResource: async (_, { resource }) => {
          resource._id = new ObjectId();
          resource.likes = "0";
          resource.dislikes = "0";
          resource.comments = []; 
          await ResourcesCollection.insertOne(resource);
          return resource;
        },
      },
      GraphQLDate,
    };

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      formatError: error => {
        console.error(error);
        return error;
      },
      
    });

    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  } catch (err) {
    console.error(err);
  }
})();

const validateJob = (job) => {
  let errors = [];

  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
};

const validateEvent = (event) => {
  let errors = [];

  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
};
