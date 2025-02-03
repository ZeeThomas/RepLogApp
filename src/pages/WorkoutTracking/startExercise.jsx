import {useState, useContext, useEffect} from "react";
import { ExerciseCard } from "./exerciseCard";
import {auth, db} from "../../config/firebase";
import { updateDoc, getDoc, doc, arrayRemove } from "firebase/firestore";
import {WorkoutHeader} from "./workoutHeader"
import { ListExercises } from "./listExercises";
import {useNavigate} from "react-router-dom";
import {NavigationBar} from "../navigationBar";

export const StartExercise = () =>
{
    //the props is the day of the week
    const uid = auth.currentUser.uid;
    const today = new Date();
    let dayIndex = today.getDay(); //this function returns 0-6
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday","Friday", "Saturday", "Sunday"];
    const day = daysOfWeek[dayIndex];
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [workouts, setWorkout] = useState();
    const [headerData, setHeaderData] = useState({})
    const [rest, setRest] = useState(false);
    let restday = false; // Default value
    let exercises = [];
    let length = 0;
    let workoutName = "Default Workout";
    async function saveInfo ()
    {
        //saving the info from the header to DB
        try {
            //console.log("this is a header data", headerData.length);
            const workoutDocRef = doc(db, "users", uid, "workouts", day);
            await updateDoc(workoutDocRef, {
                name:headerData.name,
                restday: headerData.restday,
                length: headerData.length,
            });
            workoutName = headerData.name;
            setRest(headerData.restDay);
            length = headerData.lengthOfExercise
            console.log("Workout Data saved successfully!")
            fetchAllExercises()
            navigate('/activeWorkout', { state: { workouts } });
        }
        catch (error){
            console.log("Error saving workout", error);
        }

    }
    const updateHeaderData = (updatedData) => 
    {
        setHeaderData(updatedData);
        console.log("updating data to: ", updatedData);
    }
    const fetchAllExercises = async() => 
    {
        
        try
        {
            let workoutData = [];
            const workoutDocRef = doc(db, "users", uid, "workouts", day)
            const docSnap = await getDoc(workoutDocRef);

            if(docSnap.exists())
            {
               workoutData = docSnap.data();
               
               exercises = workoutData.exercises || [];
               length = workoutData.length;
               restday = workoutData.restday;
               workoutName = workoutData.name;
               console.log("this is the workout", workoutData.exercises.length);
            }
            else
            {
                console.log("no data was found for ", day)
            }
            setWorkout(workoutData)
            updateHeaderData(workoutData)
        } catch (error)
        {
            console.error("Error fetching workout", error)
        }
        finally 
        {
            setLoading(false);
        }
        
    }
    useEffect(() => 
    {
        if (uid)
        {
           fetchAllExercises();
            
        }
    }, [uid])
   
    if (loading)
    {
        return (
            <div className="loading-screen">
                <p>Loading...Info</p>
            </div>
        )
    }
    return(

        <div className="workoutDiplayContainer">
           <div className="workoutHeader">
            <WorkoutHeader 
            workoutName={workouts.name}
            day = {day}
            time = {workouts.length}
            restDay = {workouts.restday}
            numExercises = {workouts.exercises.length}
            updateHeaderData ={setHeaderData}
            />
           </div>
            {rest === false?(
                <>
                    {console.log("rest day is ====", rest)}
                    <div className="exercises-list">
                        <ListExercises 
                        exercises= {workouts.exercises}
                        day = {day}
                        />
                    </div>
                    <div className="start-workout-button">
                            <button id = 'start-workout-btn' onClick={saveInfo}>Start</button>
                    </div>    
                       
                </>
            ): (
                <div className="is-rest-day-container">
                    <p>Rest isn't a reward for work; it's part of the work.</p>
                </div>
            )}
           
            <div className="NavBar">
               <NavigationBar />
            </div>
        </div>
        
    );
};