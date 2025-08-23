import "./app.scss";
import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import Watch from "./pages/watch/Watch";
import Login from "./pages/login/Login";
import Landing from "./pages/landing/Landing";

import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./authContext/AuthContext";

const App = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? <Home /> : <Landing />
        }
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/" />}
      />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route 
        path="/movies" 
        element={user ? <Home type="movie" /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/series" 
        element={user ? <Home type="series" /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/watch" 
        element={user ? <Watch /> : <Navigate to="/login" />} 
      />
      
    </Routes>
  );
};

export default App;
