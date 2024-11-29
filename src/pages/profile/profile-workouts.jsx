import "../../styles/profile.css";
import addIcon from "../../assets/add.png";
import optionsIcon from "../../assets/instant_mix.png";
import {auth, db} from "../../config/firebase";
import {getAuth} from "firebase/auth";
import {doc, setDoc,getDoc} from "firebase/firestore";
import {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom";
export const ProfileWorkouts= () => 
{
    const [workouts, setWorkouts] = useState({});
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
        setWorkouts(workoutData)
        };
        fetchAllWorkouts();
    }, [uid]);
    const displayWorkout = (day) => 
    {
        const workout = workouts[day];
        
        if(!workout || workout.exercises.length === 0)
        {
          return <button onClick={() =>goToAddWorkout(day)}className={`addWorkout ${day.toLowerCase()}`} workoutButtons><img src={addIcon} alt="add icon" /> Add Workout</button>
        }
       if (workout.restday == true) 
       {
           return <p className="restDay">Rest Day</p>
       }
    };
    const goToAddWorkout = (day) =>
    {
        console.log(day);
        navigate("/addWorkout", 
        {
            state :
            {
            day: day,
            id: uid,
            }
        });
    }
    const setOptions = (day) =>
    {
       console.log("setOptions");
    };


    return (
        <div className="workout-container">
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