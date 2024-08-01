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

const app = express();
const port = process.env.PORT || 5500;
const URI = process.env.MONGODB_URI;
const saltRounds = 10;

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

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: URI }),
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

function isAuthenticated(req, res, next) {
  if (req.session.user) {
      return next();
  } else {
      res.status(401).send('Unauthorized');
  }
}

app.use('/addNew', isAuthenticated);
app.use('/jobboard', isAuthenticated);
app.use('/viewEvents', isAuthenticated);
app.use('/viewResources', isAuthenticated);

app.get('/api/current_user', (req, res) => {
  if (req.session.user) {
      res.json({ user: req.session.user });
  } else {
      res.status(401).json({ error: 'No active session' });
  }
});

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

let database, JobsCollection, EventsCollection, ResourcesCollection, UsersCollection;

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
        singleEvent: async (_, { id }) => {
          const Event = await EventsCollection.findOne({ _id: new ObjectId(id) });
          return Event;
        },
        resourceList: async () => {
          const resources = await ResourcesCollection.find({}).toArray();
          return resources;
        },
        singleResource: async (_, { id }) => {
          const Resource = await ResourcesCollection.findOne({ _id: new ObjectId(id) });
          return Resource;
        },
        getUserById: async (_, { id }) => {
          const user = await UsersCollection.findOne({ _id: new ObjectId(id) });
          return user;
        },
        singleUser: async (_, { id }) => {
          const user = await UsersCollection.findOne({ _id: new ObjectId(id) });
          return user;
        },
        usersByIds: async (_, { ids }) => {
          const objectIds = ids.map(id => new ObjectId(id));
          const users = await UsersCollection.find({ _id: { $in: objectIds } }).toArray();
          return users;
        },
        userList: async () => {
          const users = await UsersCollection.find({ role: { $in: ["Student", "Alumni"], $ne: "Admin" } }).toArray();
          return users;
        }
      },
      Mutation: {
        addJob: async (_, { job }, { req }) => {
          validateJob(job);
          job._id = new ObjectId();
          job.postedBy = req.session.userId || "Smeet";
          job.applications = "0";
          await JobsCollection.insertOne(job);
          return job;
        },
        updateJob: async (_, { id, job }) => {
          await JobsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: job }
          );
          return await JobsCollection.findOne({ _id: new ObjectId(id) });
        },
        applyForJob: async (_, { jobId, userId }) => {
          const job = await JobsCollection.findOne({ _id: new ObjectId(jobId) });
          if (!job) {
            throw new Error('Job not found');
          }
      
          const applications = job.applications ? job.applications.split(',') : [];
          if (!applications.includes(userId)) {
            applications.push(userId);
            await JobsCollection.updateOne(
              { _id: new ObjectId(jobId) },
              { $set: { applications: applications.join(',') } }
            );
          }
      
          return await JobsCollection.findOne({ _id: new ObjectId(jobId) });
        },
        deleteJob: async (_, { _id }) => {
          const result = await JobsCollection.deleteOne({ _id: new ObjectId(_id) });
          return result.deletedCount === 1;
        },
        addEvent: async (_, { event }, { req }) => {
          validateEvent(event);
          event._id = new ObjectId();
          event.attendees = "0";
          event.postedBy = req.session.userId || "Smeet";
          await EventsCollection.insertOne(event);
          return event;
        },
        updateEvent: async (_, { id, event }) => {
          await EventsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: event }
          );
          return await EventsCollection.findOne({ _id: new ObjectId(id) });
        },
        deleteEvent: async (_, { _id }) => {
          const result = await EventsCollection.deleteOne({ _id: new ObjectId(_id) });
          return result.deletedCount === 1;
        },
        addResource: async (_, { resource }, { req }) => {
          resource._id = new ObjectId();
          resource.createdAt = new Date();
          validateResource(resource);
          resource.likes = "0";
          resource.dislikes = "0";
          resource.postedBy = req.session.userId || "Smeet";
          console.log(req.session.userId);
          resource.comments = [];
          await ResourcesCollection.insertOne(resource);
          return resource;
        },
        updateResource: async (_, { id, resource }) => {
          await ResourcesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: resource }
          );
          return await ResourcesCollection.findOne({ _id: new ObjectId(id) });
        },
        deleteResource: async (_, { _id }) => {
          const result = await ResourcesCollection.deleteOne({ _id: new ObjectId(_id) });
          return result.deletedCount === 1;
        },
        addUser: async (_, { user }) => {
          validateUser(user);
          const hashedPassword = await bcrypt.hash(user.password, saltRounds);
          user.password = hashedPassword;
          user._id = new ObjectId();
          user.connections="";
          user.pendingConnections="";
          await UsersCollection.insertOne(user);
          return user;
        },
        login: async (_, { credentials }, { req }) => {
          const { email, password } = credentials;
    
          const user = await UsersCollection.findOne({ email });
          if (!user) {
            throw new AuthenticationError('Invalid email or password');
          }
    
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            throw new AuthenticationError('Invalid email or password');
          }
    
          req.session.userId = user._id;
          req.session.user = user;
    
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
        updateUser: async (_, { id, input }) => {
          const user = await UsersCollection.findOne({ _id: new ObjectId(id) });
          if (!user) {
            throw new Error('User not found');
          }
          const updatedUser = await UsersCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: input },
            { returnOriginal: false }
          );
          return updatedUser.value;
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
