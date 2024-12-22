import {useState, useContext, useEffect} from "react";
import {UserContext} from "../../App";
import { ExerciseCard } from "./exerciseCard";
import {auth, db} from "../../config/firebase";
import { updateDoc, getDoc, doc, arrayRemove } from "firebase/firestore";

export const ListExercises = (props) => 
{
    const {user, setUser}= useContext(UserContext);
    const uid = auth.currentUser.uid;
    const { exercises, day } = props;
    const [exerciseList, setExerciseList] = useState([]);
    const [loading, setLoading] = useState(true);
   //console.log(exercises);
   const fetchExercises = async () =>
   {
        try
        {
            const workoutDocRef = doc(db, "users", uid, "workouts", day);
            const workoutDoc = await getDoc(workoutDocRef);
            
            if (workoutDoc.exists())
            {
                console.log("it exist",workoutDoc.data().exercises)
                setExerciseList(workoutDoc.data().exercises || []);
            } else 
            {
                setExerciseList([]);
            }
           

        }catch(error)
        {
            console.log("error grabbing exercises", error)
        }finally
        {
            setLoading(false);
        }
   }
   const handleDelete = async(exerciseObject) => 
   {
        try
        {
            const workoutDocRef = doc(db, "users", uid, "workouts", day);

            await updateDoc(workoutDocRef, 
                {
                    exercises: arrayRemove(exerciseObject)
                });
            console.log(`${exerciseObject.name} has been removed from the exercises`);
            fetchExercises();
        }catch (error)
        {
            console.log("Error removeing exercise ", exerciseObject.name, " error is: ", error);
        }
   }
   useEffect (() => 
   {
    fetchExercises();
   },[]);

   if (loading)
   {
        return <p>Loading...</p>
   }
    return(
        <div>
            {fetchExercises}
            {exerciseList && exerciseList.length > 0 ?(
                exerciseList.map((exerciseList, index) => (
                    /*The info needs to be sent to the card. Name, sets, reps, weight. */
                    
                    <ExerciseCard
                    name={exerciseList.name}
                    set={exerciseList.set}
                    reps={exerciseList.reps}
                    weight={exerciseList.weight}
                    onDelete={handleDelete}
                    />
                )
            )
            ): (
                <p>Zip...Nada...Nothing</p>
            )}
        </div>
    );
};