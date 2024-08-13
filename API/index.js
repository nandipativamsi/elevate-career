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
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 5500;
const URI = process.env.MONGODB_URI;
const saltRounds = 10;
app.use(bodyParser.json());

const corsOptions = {
  origin: 'https://elevate-careers.onrender.com', 
  credentials: true, 
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://elevate-careers.onrender.com');
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

const profileImageStorage = createStorage('../UI/src/assets/ProfileImages');
const uploadProfileImage = multer({ storage: profileImageStorage });

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

app.post('/ProfileImage/upload', uploadProfileImage.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ imageName: req.file.filename });
});

app.post('/payment', async (req, res) => {  
  const { eventTitle, amount, userEmail } = req.body; // Get eventTitle and amount from the request

  try {
      const product = await stripe.products.create({
          name: eventTitle, // Use the event title as the product name
      });

      const price = await stripe.prices.create({
          product: product.id,
          unit_amount: amount * 100, 
          currency: 'cad',
      });

      const session = await stripe.checkout.sessions.create({
          line_items: [
              {
                  price: price.id,
                  quantity: 1,
              }
          ],
          mode: 'payment',
          success_url: 'https://elevate-careers.onrender.com/transactionSuccess',
          cancel_url: 'https://elevate-careers.onrender.com/transactionFailure',
          customer_email: userEmail, 
      });

      res.json({ url: session.url });
  } catch (error) {
      console.error('Error creating payment session:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



// app.use(session({
//   secret: 'your-secret-key',
//   resave: false,
//   saveUninitialized: true,
//   store: MongoStore.create({ mongoUrl: URI }),
//   cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
// }));

app.use(
  session({
    secret: "EaByDtUXFXu7VYT-mA6NuGh68jGA",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // Use your MongoDB connection string here
      ttl: 14 * 24 * 60 * 60, // 14 days expiry
    }),
    cookie: {
      secure:true, 
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

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
        jobList: async (_, { jobType, workType }) => {
          // Build the query based on provided arguments
          const query = {};
          if (jobType) query.jobType = jobType;
          if (workType) query.workType = workType;
          
          // Fetch jobs from the collection
          const jobs = await JobsCollection.find(query).toArray();
          return jobs;
        },
        singleJob: async (_, { id }) => {
          const job = await JobsCollection.findOne({ _id: new ObjectId(id) });
          return job;
        },
        jobsByUser: async (_, { userId, jobType, workType }) => {
          const query = { postedBy: userId };
          if (jobType) query.jobType = jobType;
          if (workType) query.workType = workType;
          
          const jobs = await JobsCollection.find(query).toArray();
          return jobs;
        },
        resourcesByUser: async (_, { userId }) => {
          const resources = await ResourcesCollection.find({ postedBy: userId }).toArray();
          return resources;
        },
        eventsByUser: async (_, { userId }) => {
          const events = await EventsCollection.find({ postedBy: userId }).toArray();
          return events;
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
        usersByIds: async (_, { ids }) => {
          return await UsersCollection.find({ _id: { $in: ids.map(id => new ObjectId(id)) } }).toArray();
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
          const users = await UsersCollection.find({ 
            role: { $in: ["Student", "Alumni", "Admin"]},
          }).toArray();
          return users;
        }, 
        checkRegistration: async (_, { eventId, userId }) => {
          const event = await EventsCollection.findOne({ _id: new ObjectId(eventId) });
          if (!event) {
            throw new Error('Event not found');
          }
          const registeredUsers = event.registeredUsers || [];
          return registeredUsers.includes(userId);
        },
      },
      Mutation: {
        addJob: async (_, { job }, { req }) => {
          validateJob(job);
          job._id = new ObjectId();
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
          event.attendees = "";
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
       
        registerForEvent: async (_, { eventId, userId }) => {
          const event = await EventsCollection.findOne({ _id: new ObjectId(eventId) });
    if (!event) {
        throw new Error('Event not found');
    }

    // Initialize attendees as an empty array if it's not defined
    let attendees = event.attendees || "";

    // Convert attendees string to an array
    let attendeesArray = attendees ? attendees.split(',').map(id => id.trim()) : [];

    // Convert userId to string for comparison
    const userIdString = new ObjectId(userId).toString();

    if (attendeesArray.includes(userIdString)) {
        return false; // User is already registered
    }
    
    // Add the new userId to the attendees list
    attendeesArray.push(userIdString);

    // Convert the array back to a comma-separated string
    const updatedAttendees = attendeesArray.join(',');

    // Update the event document with the new attendees string
    await EventsCollection.updateOne(
        { _id: new ObjectId(eventId) },
        { $set: { attendees: updatedAttendees } }
    );

    return true; // Successfully registered
        },
        addResource: async (_, { resource }, { req }) => {
          resource._id = new ObjectId();
          resource.createdAt = new Date();
          validateResource(resource);
          resource.likes = "0";
          resource.dislikes = "0";
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
        addComment: async (_, { resourceId, comment }) => {
          const result = await ResourcesCollection.findOneAndUpdate(
              { _id: new ObjectId(resourceId) },
              { $push: { comments: comment } },
              { returnOriginal: false }
          );

          const updatedResource = await ResourcesCollection.findOne({ _id: new ObjectId(resourceId) });

          return updatedResource;
        },
        likeResource: async (_, { resourceId }) => {
          // Fetch the resource from the database
          const resource = await ResourcesCollection.findOne({ _id: new ObjectId(resourceId) });
          if (!resource) throw new Error('Resource not found');
  
          // Convert likes to integer and increment
          const currentLikes = parseInt(resource.likes, 10) || 0;
          const updatedLikes = currentLikes + 1;
  
          // Update the resource with the new like count
          await ResourcesCollection.updateOne(
              { _id: new ObjectId(resourceId) },
              { $set: { likes: updatedLikes.toString() } }
          );
  
          // Fetch and return the updated resource
          return await ResourcesCollection.findOne({ _id: new ObjectId(resourceId) });
      },
  
      dislikeResource: async (_, { resourceId }) => {
          // Fetch the resource from the database
          const resource = await ResourcesCollection.findOne({ _id: new ObjectId(resourceId) });
          if (!resource) throw new Error('Resource not found');
  
          // Convert dislikes to integer and increment
          const currentDislikes = parseInt(resource.dislikes, 10) || 0;
          const updatedDislikes = currentDislikes + 1;
  
          // Update the resource with the new dislike count
          await ResourcesCollection.updateOne(
              { _id: new ObjectId(resourceId) },
              { $set: { dislikes: updatedDislikes.toString() } }
          );
  
          // Fetch and return the updated resource
          return await ResourcesCollection.findOne({ _id: new ObjectId(resourceId) });
      },
  
        addUser: async (_, { user }) => {
          validateUser(user);
          const hashedPassword = await bcrypt.hash(user.password, saltRounds);
          user.password = hashedPassword;
          user._id = new ObjectId();
          user.connections="";
          user.pendingConnectionsAcceptor="";
          user.pendingConnectionsRequestor="";
          user.profileImage="";
          user.skills="";
          user.interests="";
          user.linkedInURL="";
          user.gitHubURL="";
          user.socialMediaURL=""
          user.status="Active";
          await UsersCollection.insertOne(user);
          return user;
        },

       blockUser: async (_, { userId }, { User }) => {
          try {
              // Find the user by ID
              const user = await UsersCollection.findOne({ _id: new ObjectId(userId) });
              
              // If user not found, throw an error
              if (!user) throw new Error('User not found');
              
              // Update the user's status to 'blocked'
              const updatedUser = await UsersCollection.findOneAndUpdate(
                  { _id: new ObjectId(userId) },
                  { $set: { status: 'Blocked' } },
                  { returnOriginal: false }  // return the updated document
              );
      
              // Return the updated user document
              return updatedUser;
          } catch (error) {
              // Throw an error if something goes wrong
              throw new Error(error.message);
          }
      },
      

        sendConnectionRequest: async (_, { fromUserId, toUserId }) => {
          const toUser = await UsersCollection.findOne({ _id: new ObjectId(toUserId) });
          const fromUser = await UsersCollection.findOne({ _id: new ObjectId(fromUserId) });
    
          if (!toUser || !fromUser) {
            throw new Error('User not found');
          }
    
          // Update toUser's pendingConnectionsAcceptor
          const toUserPendingConnectionsAcceptor = toUser.pendingConnectionsAcceptor ? toUser.pendingConnectionsAcceptor.split(',') : [];
          if (!toUserPendingConnectionsAcceptor.includes(fromUserId)) {
            toUserPendingConnectionsAcceptor.push(fromUserId);
          }
    
          await UsersCollection.updateOne(
            { _id: new ObjectId(toUserId) },
            { $set: { pendingConnectionsAcceptor: toUserPendingConnectionsAcceptor.join(',') } }
          );
    
          // Update fromUser's pendingConnectionsRequestor
          const fromUserPendingConnectionsRequestor = fromUser.pendingConnectionsRequestor ? fromUser.pendingConnectionsRequestor.split(',') : [];
          if (!fromUserPendingConnectionsRequestor.includes(toUserId)) {
            fromUserPendingConnectionsRequestor.push(toUserId);
          }
    
          await UsersCollection.updateOne(
            { _id: new ObjectId(fromUserId) },
            { $set: { pendingConnectionsRequestor: fromUserPendingConnectionsRequestor.join(',') } }
          );
    
          return await UsersCollection.findOne({ _id: new ObjectId(toUserId) });
        },
    
        acceptConnectionRequest: async (_, { fromUserId, toUserId }) => {
          const toUser = await UsersCollection.findOne({ _id: new ObjectId(toUserId) });
          const fromUser = await UsersCollection.findOne({ _id: new ObjectId(fromUserId) });
    
          const toUserConnections = toUser.connections ? toUser.connections.split(',') : [];
          const fromUserConnections = fromUser.connections ? fromUser.connections.split(',') : [];
          const toUserPendingConnectionsAcceptor = toUser.pendingConnectionsAcceptor ? toUser.pendingConnectionsAcceptor.split(',') : [];
          const fromUserPendingConnectionsRequestor = fromUser.pendingConnectionsRequestor ? fromUser.pendingConnectionsRequestor.split(',') : [];
    
          if (!toUserConnections.includes(fromUserId)) {
            toUserConnections.push(fromUserId);
          }
          if (!fromUserConnections.includes(toUserId)) {
            fromUserConnections.push(toUserId);
          }
    
          const updatedPendingConnectionsAcceptor = toUserPendingConnectionsAcceptor.filter(id => id !== fromUserId);
          const updatedPendingConnectionsRequestor = fromUserPendingConnectionsRequestor.filter(id => id !== toUserId);
    
          await UsersCollection.updateOne(
            { _id: new ObjectId(toUserId) },
            { $set: { 
                connections: toUserConnections.join(','), 
                pendingConnectionsAcceptor: updatedPendingConnectionsAcceptor.join(',') 
              } 
            }
          );
    
          await UsersCollection.updateOne(
            { _id: new ObjectId(fromUserId) },
            { $set: { 
                connections: fromUserConnections.join(','), 
                pendingConnectionsRequestor: updatedPendingConnectionsRequestor.join(',') 
              } 
            }
          );
    
          return await UsersCollection.findOne({ _id: new ObjectId(toUserId) });
        },
    
        rejectConnectionRequest: async (_, { fromUserId, toUserId }) => {
          const toUser = await UsersCollection.findOne({ _id: new ObjectId(toUserId) });
          const toUserPendingConnectionsAcceptor = toUser.pendingConnectionsAcceptor ? toUser.pendingConnectionsAcceptor.split(',') : [];
          const updatedPendingConnectionsAcceptor = toUserPendingConnectionsAcceptor.filter(id => id !== fromUserId);
    
          await UsersCollection.updateOne(
            { _id: new ObjectId(toUserId) },
            { $set: { pendingConnectionsAcceptor: updatedPendingConnectionsAcceptor.join(',') } }
          );
    
          const fromUser = await UsersCollection.findOne({ _id: new ObjectId(fromUserId) });
          const fromUserPendingConnectionsRequestor = fromUser.pendingConnectionsRequestor ? fromUser.pendingConnectionsRequestor.split(',') : [];
          const updatedPendingConnectionsRequestor = fromUserPendingConnectionsRequestor.filter(id => id !== toUserId);
    
          await UsersCollection.updateOne(
            { _id: new ObjectId(fromUserId) },
            { $set: { pendingConnectionsRequestor: updatedPendingConnectionsRequestor.join(',') } }
          );
    
          return await UsersCollection.findOne({ _id: new ObjectId(toUserId) });
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
        updateUser: async (_, { id, user }) => {
          console.log("Server Side " + {user});
          const oldUser = await UsersCollection.findOne({ _id: new ObjectId(id) });
          if (!oldUser) {
            throw new Error('User not found');
          }
          const updatedNewUser = await UsersCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: user },
            { returnOriginal: false }
          );
          return updatedNewUser;
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
