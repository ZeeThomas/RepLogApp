import {useForm} from "react-hook-form";
import {auth, db} from "../../config/firebase";

import closeIcon from "../../assets/close.png";
import { useLocation } from 'react-router-dom';

import {doc, updateDoc, arrayUnion} from "firebase/firestore";
import {useNavigate} from "react-router-dom";

export const AddExercise = () =>
{    
    const navigate = useNavigate();

    const location = useLocation();
    const { workoutData } = location.state || "";
    const day = workoutData.day;
    //console.log("addExercise recieved", day)
    const uid = auth.currentUser?.uid;


    const{register, handleSubmit,} =useForm();
    const OnSubmit = (data) => 
    {
        const newExercise = {
            name: data.name,
            reps: data.reps,
            set: data.sets,
            weight: data.weight,
        }
        addExerciseToDB(newExercise);
        goBack()
    }
    const goBack = () =>
    {
        const userData = {day: day, id: uid};

        navigate('/addWorkout', { state: { userData } });
    }
    async function addExerciseToDB(newExercise)
    {
      
        try {
            //console.log("the day is ", day);
            const workoutDocRef = doc(db, "users", uid, "workouts", day);
            await updateDoc(workoutDocRef, {
                exercises: arrayUnion(newExercise),
            });
            //console.log("Exercise added successfully!")
        }
        catch (error){
            //console.log("Error adding exercise", error);
        }

       
    }
    return (
        <div className="heading">
            <button onClick={goBack}><img src={closeIcon} alt="close form Icon"/></button>
            <h1>Add Exercise</h1>
            <form className="add-exercise-form" onSubmit={handleSubmit(OnSubmit)}>
            <p>Exercise Name</p>
            <input type="text" placeholder="e.g., Push-ups" {...register("name", {required:true})}/>
            <p>Reps</p>
            <input type="text" placeholder="e.g., 10" {...register("reps", {required:true})}/>
            <p>Sets</p>
            <input type="text"placeholder="e.g., 4" {...register("sets", {required:true})}/>
            <p>Weight</p>
            <input type="text" placeholder="e.g., 50" {...register("weight", {required:true})}/>
            <input  className="submitButton" type="submit" value="Submit" />

        </form>
        </div>
        
    );
}