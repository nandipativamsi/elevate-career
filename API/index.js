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
const multer = require('multer');
const path = require('path');
const User = require('./models/Users'); // Import your User model

const app = express();
const port = process.env.PORT || 5500;
const URI = process.env.MONGODB_URI;

const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true, 
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

const createStorage = (folderPath) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, folderPath));
    },
    filename: function (req, file, cb) {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      const newFileName = `${timestamp}${ext}`;
      cb(null, newFileName);
    }
  });
};

const jobImageStorage = createStorage('../UI/src/assets/JobImages');
const uploadJobImage = multer({ storage: jobImageStorage });

const eventImageStorage = createStorage('../UI/src/assets/EventImages');
const uploadEventImage = multer({ storage: eventImageStorage });

const resourceImageStorage = createStorage('../UI/src/assets/ResourceImages');
const uploadResourceImage = multer({ storage: resourceImageStorage });

app.post('/JobImage/upload', uploadJobImage.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ imageName: req.file.filename });
});

app.post('/EventImage/upload', uploadEventImage.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ imageName: req.file.filename });
});

app.post('/ResourceImage/upload', uploadResourceImage.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ imageName: req.file.filename });
});

app.use(bodyParser.json());
// Configure CORS


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
app.use('/addNew', isAuthenticated);
app.use('/jobboard', isAuthenticated);
app.use('/viewEvents', isAuthenticated);
app.use('/viewResources', isAuthenticated);

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
        singleJob: async (_, { id }) => {
          const job = await JobsCollection.findOne({ _id: new ObjectId(id) });
          return job;
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
          //console.log(job);
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
          validateResource(resource);
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
const validateResource = (resource) => {
  let errors = [];

  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
};
