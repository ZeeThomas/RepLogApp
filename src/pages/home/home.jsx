import "../../styles/home.css";
import homeIcon from "../../assets/home.png";
import dumbbellIcon from "../../assets/fitness_center.png";
import menuIcon from "../../assets/hamburger.png"
import person from "../../assets/person.png";
import {UserContext} from "../../App.js"
import {NavigationBar} from "../navigationBar.jsx"
import { ProgressBar } from "./progressBar.jsx";
import { TodaysWorkout } from "./todaysWorkout.jsx";
import { TmrWorkout } from "./tmrWorkout.jsx";
import {auth, db} from "../../config/firebase";
import {Link} from "react-router-dom";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {useState, useRef, useEffect, useContext} from "react";
import workoutImage from "../../assets/unsplash-workout-picture.jpg"

export const Home = () => 
{
    const [loading, setLoading] = useState(true);
    const [todaysWorkout, setTodaysWorkout] = useState(null)
    var [sidebarToggle, setSidebarToggle] = useState(false)
    const sidebarRef = useRef(null);
    const [tmrWorkout, setTmrWorkout] = useState(null);
    const {user} = useContext(UserContext);
    let tomorrow;
    let dayOfWeek;
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday","Friday", "Saturday", "Sunday"];
   
    let uid = auth.currentUser.uid;
  
    const fetchExercises = async(day) => 
    {
        try
        {
            let workoutData = [];
            let workoutInfo = {
                workoutName: "", 
                length: 0,
                restday: false,
                exercises: [],
        
            };
            const workoutDocRef = doc(db, "users", uid, "workouts", day)
            const docSnap = await getDoc(workoutDocRef);

            if(docSnap.exists())
            {
               workoutData = docSnap.data();
               
               workoutInfo.exercises = workoutData.exercises || [];
               workoutInfo.length = workoutData.length;
               workoutInfo.restday = workoutData.restday;
               workoutInfo.workoutName = workoutData.name;
               //console.log("this is the info for", day, ": ", workoutInfo);
               return workoutInfo;
            }
            else
            {
                //console.log("no data was found for ", day)
            }
        } catch (error)
        {
            console.error("Error fetching workout", error)
        }
        finally 
        {
            setLoading(false);
        }
        
    }
    
    //this function resets the completed fields every Monday
    const isReset = async() => 
    {
        if(dayOfWeek ===  "Monday")
        {
            //reset the completed values for each workout
            
            for (let i = 0; i < days.length; i++)
            {
                let workoutData = {};
                const workoutDocRef = doc(db, "users", uid, "workouts", days[i])
    
               try
                {
                   await updateDoc(workoutDocRef, {
                    completed: false,
                   })
                }
                catch (error)
                {
                    console.error("Eerror updating completed field: ")
                }
            }
            console.log("week updated")
        }
    }
    //this function gets every workout and finds if it's completed. 
    
    useEffect(() => 
    {
        const loadWorkouts = async () => {
            if (uid)
            {
                //console.log("Inside useEffect uid")
                dayOfWeek = currentDay()
                setLoading(true);
                isReset(dayOfWeek)
                setTodaysWorkout(await fetchExercises(dayOfWeek));
                //console.log("this is todays workout, ", todaysWorkout)
                setTmrWorkout(await fetchExercises(tomorrow))
                //console.log(setTmrWorkout)
                setLoading(false)
            }
            else 
            {
                return;
            }
        };
        function handler(e)
        {
            if (sidebarRef.current)
            {
                if(!e.target.classList.contains('sidebar') && !e.target.classList.contains('sidebar-toggle'))
                {
                    setSidebarToggle(false)
                }
            }
        }
        loadWorkouts();
        document.addEventListener("click", handler)
        return () => 
        {
            document.removeEventListener("click", handler)
        }
        
        
    }, [uid])
    const currentDay = () =>
    {
        const today = new Date();
        let dayIndex = today.getDay(); //this function returns 0-6
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday","Friday", "Saturday", "Sunday"];
        const dayName = daysOfWeek[dayIndex];
        if (dayIndex == 6)
        {
            dayIndex = -1;
        }
        tomorrow = daysOfWeek[dayIndex+1];
        return dayName;

    }
    return(
        <div className="content">
        <div className="home-container">
            <div className="header">
                <button className="sidebar-toggle" onClick={() =>setSidebarToggle(true)}><img src={menuIcon} /></button>
                <aside ref={sidebarRef} className={`sidebar ${sidebarToggle? "visible": ""}`}>
                    <div className="bar">
                        <div className={`element home active`}>
                            <Link to="/" >
                                <img src={homeIcon}/>
                                <p>Home</p>
                            </Link>
                        </div>
                        <div className={`element workout`}>
                            <Link to="/startWorkout">
                                <img src={dumbbellIcon}/>
                                <p>Workout</p>
                            </Link>
                        </div>
                        <div className={`element profile `}>
                            <Link to="/profile" >
                                <img src={person}/>
                                <p>Profile</p>
                            </Link>
                        </div>
                    </div>
                </aside>
                <h2 id= "welcome-text">Welcome Back,</h2>
                
                {/*dayOfWeek = currentDay*/}
                {/*console.log("this is the workout ", todaysWorkout)*/}
                <h2 id="home-user-text">{user.name}</h2>
            </div>
            <div className="progress-container">
              
                <ProgressBar 
                />
            </div>
            <div className="todays-exercises-container">
                <TodaysWorkout 
                workoutToday={todaysWorkout || { exercises: [], workoutName: "", length: 0 }}
                />
            </div>
            <div className="tmr-exercises-container">
                <TmrWorkout 
                workoutTmr= {tmrWorkout || { exercises: [], workoutName: "", length: 0 }}
                />
            </div>
            <div className="image-container">
                <img id="home-image" src={workoutImage}/>
            </div>
        </div>
       {/*<div className="bar-container"> 
            <NavigationBar 
            page="home"/> 
            </div>*/}
        </div>
    );


};