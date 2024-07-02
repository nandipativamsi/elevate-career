require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ApolloServer, UserInputError, AuthenticationError } = require('apollo-server-express');
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/Users'); // Import your User model

const app = express();
const port = 3000;
const URI = process.env.MONGODB_URI;

app.use(bodyParser.json());
// Configure CORS
const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true, 
};
app.use(cors(corsOptions));

// Set up session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: URI }),
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
      return next();
  } else {
      res.status(401).send('Unauthorized');
  }
}

// Apply the middleware to routes that need protection
app.use('/api/addJob', isAuthenticated);
app.use('/api/viewJobs', isAuthenticated);
app.use('/api/addEvent', isAuthenticated);
app.use('/api/viewEvents', isAuthenticated);
app.use('/api/addResource', isAuthenticated);
app.use('/api/viewResources', isAuthenticated);

// Route to get current user
app.get('/api/current_user', (req, res) => {
  if (req.session.user) {
      res.json({ user: req.session.user });
  } else {
      res.status(401).json({ error: 'No active session' });
  }
});

// Logout route
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).send('Failed to logout');
      }
      res.clearCookie('connect.sid');
      res.send('Logged out');
  });
});

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
    UsersCollection = database.collection('Users');

    const eventTypeDefs = fs.readFileSync('./models/EventSchema.graphql', 'utf-8');
    const jobTypeDefs = fs.readFileSync('./models/JobSchema.graphql', 'utf-8');
    const resourceTypeDefs = fs.readFileSync('./models/ResourceSchema.graphql', 'utf-8');
    const userTypeDefs = fs.readFileSync('./models/UserSchema.graphql', 'utf-8');
    const typeDefs = [eventTypeDefs, jobTypeDefs, resourceTypeDefs, userTypeDefs].join('\n');

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
        addUser: async (_, { user }) => {
          validateUser(user);
          user._id = new ObjectId();
          await UsersCollection.insertOne(user);
          return user;
        },
        login: async (_, { credentials }, { req }) => {
          const { email, password } = credentials;
    
          const user = await UsersCollection.findOne({ email });
          // console.log(user);
          if (!user) {
            throw new AuthenticationError('Invalid email or password');
          }

          // const isPasswordValid = await bcrypt.compare(password, user.password);
          // if (!isPasswordValid) {
          //   throw new AuthenticationError('Invalid email or password');
          // }
          if(user.password!=password){
              throw new AuthenticationError('Invalid email or password');
          }

          // Create session
          req.session.userId = user._id;
          req.session.user = user;
          // console.log(req.session.user);
    
          return {
            user,
          };
        },
        logout: (_, __, { req }) => {
          req.session.destroy((err) => {
            if (err) {
              throw new Error('Logout failed');
            }
          });
          return true;
        },
      },
      GraphQLDate,
    };

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req, res }) => ({ req, res }),
      formatError: error => {
        console.error(error);
        return error;
      },
    });

    await server.start();
    server.applyMiddleware({ app, path: '/graphql', cors: false });

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

const validateUser = (user) => {
  let errors = [];

  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
};
