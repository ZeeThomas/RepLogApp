import "../../styles/activeWorkout.css";
import upArrow from "../../assets/arrow_drop_up.png";
import downArrow from "../../assets/arrow_drop_down.png";
import checkBox from "../../assets/check_box_outline_blank.png";
import { updateDoc, getDoc, doc} from "firebase/firestore";
import clock from "../../assets/alarm.png";
import weight from "../../assets/exercise.png";
import {useNavigate} from "react-router-dom";

import {useState} from "react";
import { useLocation } from 'react-router-dom';
import {auth, db} from "../../config/firebase";


export const ActiveWorkout = () =>
{
    const location = useLocation();
    const uid = auth.currentUser.uid;
    const navigate = useNavigate();
    const { workouts } = location.state || {};
    const day = workouts.day;
    //console.log(workouts);
    var [updatedExerciseList, setUpdatedExerciseList]= useState([]);
    var [exercises,setExercises] = useState(workouts.exercises);
    var [current, setCurrent] = useState(0);
    var [nextWeight, setNextWeight] = useState(exercises.length>0? exercises[current].weight : 0);

    const numExercises = workouts.exercises.length;
    const changeWeight = (operation) =>
    {
        //changes the weight for next session by 1 either decrease or increase
        if (operation == "-")
        {
            //take away 1 from the number
            setNextWeight(nextWeight-=1);
        }
        else if (operation == "+")
        {
            setNextWeight(nextWeight++);
        }
    }
    const addLater = () =>
    {
        //This function takes the current exercise 
        //remove and then add it to the bottom of the list so that the user can go back to it later

        setExercises(prevExercises => {
            const updatedExercises = [...prevExercises];
            const exercise = updatedExercises.splice(current, 1)[0];
            updatedExercises.push(exercise);
            setNextWeight (updatedExercises[current].weight);
            return updatedExercises;
            
        })
       
       
    }
    const finishExercise = () =>
    {
       //this function takes the current exercise
       //removes it from the list, captures the weight the user has for next session
       //then addes that to a new list called updatedExerciseList 
       //then at the end of exercise it will be updated in db
        //take the exercise away 
        setExercises(prevExercises =>
            {
                const updatedExercises = [...prevExercises];
                const exercise = updatedExercises.splice(current,1)[0];
                //take note of the weight 
                exercise.weight = nextWeight;
                //add it to the updated List
                //console.log("setting weight to: " ,exercise.weight);
                setUpdatedExerciseList(prevList => [...prevList,exercise])
                if (updatedExercises.length > 0)
                {
                    //if there is another element left
                     //set the weight to next element
                    setNextWeight (updatedExercises[current].weight);
                    
                }
                //console.log("new list", updatedExercises);
                return updatedExercises;
            })
    }
    async function saveInfo ()
    {
        //saving the exercise info into DB
        try {
            const workoutDocRef = doc(db, "users", uid, "workouts", day);
            await updateDoc(workoutDocRef, {
                exercises: updatedExerciseList,
                completed: true
            });
            //console.log("exercises saved successfully!")
        }
        catch (error){
            //console.log("Error saving workout", error);
        }
       
    }
    const endSession = () =>
    {
        navigate("/")
    }
    const finishWorkout = () =>
    {
        console.log("new list is, ", updatedExerciseList)
        saveInfo()
        navigate("/");
    }
    return (
        <div className="active-workout-container">
            <div className="header">
                <div className="top-section">
                    <div className="header-info">
                        <img  src={clock} alt="clock icon" />
                        <p>{workouts.length} minutes</p>
                    </div>
                    <div className="header-info">
                        <img src={weight} alt="dumbell icon" />
                        <p>{numExercises}</p>
                    </div>
                    <button id="end-button" onClick = {()=>endSession()}>end session</button>
                </div>
                <h1 id="title">{workouts.name}</h1>
            </div>
            <div className="current">
                <h2 id="section-name">Current</h2>
                    
                        <div className="upcoming-exercises">
                            {exercises.length === 0 ? (
                                <div className="current-workout-card">
                                    <p id="finished-title">That's a wrap!</p>
                                    <button className="finish-workout-btn" onClick ={()=>finishWorkout()}>Finish Workout</button>
                                </div>
                            ): (
                                exercises.map((exercise, index) => (
                            /*The info needs to be sent to the card. Name, sets, reps, weight. */
                                    index === current ?(
                                        <div className="current-workout-card">
                                            <div className="row-1">
                                                <p id="exercise-name">{exercise.name}</p>
                                                <div className="exercise-info">
                                                    <p >{exercise.set} sets x {exercise.reps} reps</p>
                                                    <p>{exercise.weight}lbs</p>
                                                </div>
                                            </div>
                                            <div className="row-2">
                                                <p>Next Session Weight: </p>
                                            
                                                <div className="next-weight-counter">
                                                    <p>{nextWeight}</p>
                                                    <div className="arrows-container">
                                                        <button onClick={() =>changeWeight("+")} className="arrows"><img className="arrows" src={upArrow}/></button>
                                                        <button onClick={() =>changeWeight("-")}className="arrows"><img className="arrows" src={downArrow}/></button>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                            <div className="row-3">
                                                <button onClick={() =>addLater()}id="later-btn">Later</button>
                                                <button onClick= {() =>finishExercise()}id="finished-btn">Finished</button>
                                            </div>
                                            <div className="bottom-container">
                                                <p id="upcoming-title">Next...</p>
                                            </div>
                                        </div>
                                       

                                    ): index > current ?
                                    (
                                        <div className="exercise">
                                             
                                            <img src={checkBox}/><p>{exercises[index].name}</p>
                                        </div>
                                    ) : null
                                ))
                            )}
                        </div>
                    </div>
            </div>
    );
}