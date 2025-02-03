import "../../styles/profile.css";
import addIcon from "../../assets/add.png";
import editIcon from "../../assets/edit.png";
import optionsIcon from "../../assets/instant_mix.png";
import {auth, db} from "../../config/firebase";
import {getAuth} from "firebase/auth";
import {doc, setDoc,getDoc} from "firebase/firestore";
import {useState, useEffect, useContext} from "react"
import {WorkoutContext} from "../../App";
import {useNavigate} from "react-router-dom";

export const ProfileWorkouts= () => 
{
    
    const {workouts, setWorkouts}= useContext(WorkoutContext);

    const uid = auth.currentUser.uid;
    const navigate = useNavigate();

    const fetchWorkout = async(day) => 
    {
        try{
            const workoutDocRef = doc(db, "users", uid, "workouts", day);
            const docSnap = await getDoc(workoutDocRef);

            if(docSnap.exists())
            {
                return docSnap.data();
            } else
            {
                return <div>no data</div>
            }
        }
        catch (error)
        {
            console.error("error fetching workout: " , error);
        }
    
    };
    useEffect (() => {
        const fetchAllWorkouts = async () => 
        {
            const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            const workoutData = {};
            for (const day of days)
        {
            workoutData[day] = await fetchWorkout(day);
        }
        console.log(workoutData)
        setWorkouts(workoutData)
        };
        fetchAllWorkouts();
    }, [uid]);
    const displayWorkout = (day) => 
    {
        const workout = workouts[day];
        if (!workout) {
            // Placeholder or default action while workout data is being fetched
            return <p>Loading...</p>;
        }
        console.log("workout rest day is", workout)

        if (workout.restday === true) 
        {
            return <p className="restDay">Rest Day<button className="edit-button" onClick={() =>goToAddWorkout(day)}><img className="editIcon" src={editIcon} alt="edit icon" /></button></p>
        }
        else if(!workout || workout.exercises.length === 0)
        {
          return <button onClick={() =>goToAddWorkout(day)}className={`addWorkout ${day.toLowerCase()}`} workoutButtons><img src={addIcon} alt="add icon" /> Add Workout</button>
        }
        else 
        {
          return <button onClick={() =>goToAddWorkout(day)}className={"workout-name"} workoutButtons> {workout.name} Day!<img className="editIcon" src={editIcon} alt="edit icon" /></button>
        }
       
       
       /*need an if statement for if there is a workout there */
    };
    const goToAddWorkout = (day) =>
    {
        const userData = {day: day, id: uid};

        navigate('/addWorkout', { state: { userData } });
    }
    const setOptions = (day) =>
    {
       console.log("setOptions");
    };


    return (
        <div id="workout-container">
           {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
        <div key={day} className= {`workout-day ${day.toLowerCase()}` }>
          <h3 className="daysOfWeek">
            {day}
          </h3>
          {displayWorkout(day)}
        </div>
      ))}
        </div>
    );
}