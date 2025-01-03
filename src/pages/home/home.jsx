import "../../styles/home.css";
import {UserContext} from "../../App.js"
import {NavigationBar} from "../navigationBar.jsx"
import { ProgressBar } from "./progressBar.jsx";
import { TodaysWorkout } from "./todaysWorkout.jsx";
import { TmrWorkout } from "./tmrWorkout.jsx";
import {auth, db} from "../../config/firebase";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {useState, useEffect, useContext} from "react";
import workoutImage from "../../assets/unsplash-workout-picture.jpg"

export const Home = () => 
{
    const [loading, setLoading] = useState(true);
    const [todaysWorkout, setTodaysWorkout] = useState(null)
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
        loadWorkouts();
        
        
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
        <div className="home-container">
            <div className="header">
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
            <NavigationBar 
            page="home"/> 
        </div>
    );


};