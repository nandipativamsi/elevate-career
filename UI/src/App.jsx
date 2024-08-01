import React, {useState} from 'react';
import Header from './pages/Header';
import Footer from './pages/footer';
import LoginForm from './pages/Login';
import RegistrationForm from './pages/register';
import Home from './pages/Home';
import AddJob from './pages/AddJob';
import AddNew from './pages/AddNew';
import AddEvent from './pages/AddEvent';
import ViewEvents from './pages/ViewEvents';
import AddResource from './pages/AddResource';
import ViewResources from './pages/ViewResources';
import ResourceDetails from './pages/ResourceDetails';
import JobBoard from './pages/jobBoard';
import JobDetails from './pages/jobDetails';
import JobApplications from './pages/JobApplications';
import HelpCenter from './pages/HelpCenter';
import ConnectionsPage from './pages/Connections';
import PrivateRoute from './utils/PrivateRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import AlertComponent from './pages/AlertComponent'; 
import ProfilePage from './pages/Profile';

function App() {
  const [title, updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);
  return (
    <Router>
      <div>
        <Header title={title}/>
        <div>
          <Switch>
            <Route path="/" exact={true}>
              <Home />
            </Route>
            <Route path="/register">
              <RegistrationForm showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/login">
              <LoginForm showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/addJob"><AddJob/></Route>
            <Route path="/jobDetails/:id"><JobDetails/></Route>
            <Route path="/jobApplications/:id"><JobApplications/></Route>
            <Route path="/editJob/:id"><AddJob/></Route>
            <Route path="/addNew"><AddNew/></Route>
            <Route path="/addEvent"><AddEvent/></Route>
            <Route path="/editEvent/:id"><AddEvent/></Route>
            <Route path="/viewEvents"><ViewEvents/></Route>
            <Route path="/addResource"><AddResource/></Route>
            <Route path="/editResource/:id"><AddResource/></Route>
            <Route path="/viewResources"><ViewResources/></Route>
            <Route path="/viewResourcesDetails/:id"><ResourceDetails/></Route> 
            <Route path="/connections"><ConnectionsPage/></Route>
            <Route path="/profile"><ProfilePage/></Route>
            <Route path="/home">
              <Home/>
            </Route>
            <Route path="/jobboard"><JobBoard/></Route>
            <Route path="/help-center"><HelpCenter/></Route>
          </Switch>
          <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage}/>
        </div>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
