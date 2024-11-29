import './styles/App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Home} from "./pages/home"
import {Login} from "./pages/log-signin/login"
import {SignUp} from "./pages/log-signin/signUp"
import {Profile} from "./pages/profile/profile"
import {AddWorkout} from "./pages/addWorkout"
import { useState, createContext } from 'react';

export const UserContext = createContext();
function App() {
  const [user, setUser] = useState({
    name: "",
    numWorkouts: 0, 
    age:0,
    sex: "",
  });
  return (
    <div className="App">
      <Router>
        <UserContext.Provider value={{user: user, setUser:setUser}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/signUp" element={<SignUp />}/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/addWorkout" element={<AddWorkout />}/>
        </Routes>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
