import "../../styles/addWorkout.css";
import {useState, useEffect, useContext, useNavigation} from "react";
import { useLocation } from 'react-router-dom';
import {auth, db} from "../../config/firebase";
import {getAuth} from "firebase/auth";
import {doc, updateDoc,getDoc} from "firebase/firestore";
import {WorkoutContext} from "../../App";
import {WorkoutHeader} from "./workoutHeader"
import { ListExercises } from "./listExercises";
import addIcon from "../../assets/add_circle.png";
import {useNavigate} from "react-router-dom";
import {NavigationBar} from "../navigationBar";




export const AddWorkout = () =>
{
    const navigate = useNavigate();
    const location = useLocation();
    const { userData } = location.state || {};
    const day = userData.day;
    const uid = userData.id;
    const [loading, setLoading] = useState(true);
    const [workouts, setWorkout] = useState();
    const [headerData, setHeaderData] = useState({})
    const [rest, setRest] = useState(false);
    let restday = false; // Default value
    let exercises = [];
    let length = 0;
    let workoutName = "Default Workout";
    console.log(userData)
    
   /* 
    const {workouts, setWorkouts}= useContext(WorkoutContext);
    const theWorkout = workouts[day];
    const dayOfWeek = day;
    const exercises = theWorkout.exercises || [];
    const length = theWorkout.length;
    const restday = theWorkout.restday;
    console.log("sending rest as", restday)*/
    async function saveInfo ()
    {
        //saving the info from the header to DB
        try {
            console.log(headerData);
            const workoutDocRef = doc(db, "users", uid, "workouts", day);
            await updateDoc(workoutDocRef, {
                name:headerData.workoutName,
                restday: headerData.restDay,
                length: headerData.lengthOfExercise
            });
            workoutName = headerData.name;
            setRest(headerData.restDay);
            length = headerData.lengthOfExercise
            console.log("Workout Data saved successfully!")
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
            fetchAllExercises()
        }
    }, [uid])
    const addExercise = () =>
    {
        const workoutData = {day: day};

        navigate('/addExercise',{ state: { workoutData } });
    }
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
                        <div className="add-exercise-button">
                            <button id="add-btn" onClick={addExercise}><img src={addIcon} alt="add exercise icon"/></button>
                        </div>
                       
                </>
            ): (
                <div className="is-rest-day-container">
                    <p>Rest isn't a reward for work; it's part of the work.</p>
                </div>
            )}
             <div className="save-workout-button">
                            <button id = 'save-btn' onClick={saveInfo}>Save</button>
            </div>
            <div className="NavBar">
               <NavigationBar />
            </div>
        </div>
    );
};