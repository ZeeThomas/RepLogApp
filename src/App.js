import './styles/App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Home} from "./pages/home/home"
import {Login} from "./pages/log-signin/login"
import {SignUp} from "./pages/log-signin/signUp"
import {Profile} from "./pages/profile/profile"
import {AddWorkout} from "./pages/WorkoutTracking/addWorkout"
import { AddExercise } from './pages/WorkoutTracking/addExercise';
import {StartExercise} from './pages/WorkoutTracking/startExercise';
import {ActiveWorkout} from './pages/WorkoutTracking/activeWorkout';
import { Navigate } from "react-router-dom";



import { useState, createContext } from 'react';

export const UserContext = createContext();
export const WorkoutContext = createContext();
function App() {
  const [user, setUser] = useState({
    name: "",
    numWorkouts: 0, 
    age:0,
    sex: "",
  });
  const [workouts, setWorkouts] = useState({});

  return (
    <div className="App">
      <Router basename="https://zeethomas.github.io/RepLogApp/">
        <UserContext.Provider value={{user: user, setUser:setUser}}>
        <WorkoutContext.Provider value={{workouts: workouts, setWorkouts:setWorkouts}}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/signUp" element={<SignUp />}/>
          <Route path="/startWorkout" element={<StartExercise />} />
          <Route path="/profile" element={<Profile />}/>
          <Route path="/addWorkout" element={<AddWorkout />}/>
          <Route path="/addExercise" element={<AddExercise />}/>
          <Route path="/activeWorkout" element={<ActiveWorkout />} />

        </Routes>
        </WorkoutContext.Provider>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
