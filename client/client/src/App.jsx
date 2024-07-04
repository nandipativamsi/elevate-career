import React, {useState} from 'react';
import Header from './pages/Header';
import Footer from './pages/footer';
import LoginForm from './pages/Login';
import RegistrationForm from './pages/register';
import Home from './pages/Home';
import PrivateRoute from './utils/PrivateRoutes';
import {
  Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import AlertComponent from './pages/AlertComponent';  
function App() {
  const [title, updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);
  return (

    <div>
      
        <div>
          <BrowserRouter>
            <Header title={title}/>
            <Routes>
              <Route path="/" element={<LoginForm showError={updateErrorMessage} updateTitle={updateTitle}/>} />
              <Route path="/register" element={<RegistrationForm showError={updateErrorMessage} updateTitle={updateTitle}/>} />
              <Route path="/login" element={<LoginForm showError={updateErrorMessage} updateTitle={updateTitle}/>} />
              <Route path="/home" element={<Home/>} />
            </Routes>
          </BrowserRouter>
          <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage}/>
        </div>
      <Footer/>
    </div>
    

  );
}

export default App;