import "../../styles/progressBar.css";
import {useEffect,useState, useRef} from "react";
import {doc, getDoc} from "firebase/firestore";
import {auth, db} from "../../config/firebase";
import { get } from "react-hook-form";

export const ProgressBar = () =>
{
    //let progressPercent = 0;
    const [loading, setLoading] = useState(true)
    const [progressPercent, setProgressPercent] = useState(0)
    const radialProgressRef = useRef(null)
    const [completedWorkouts, setCompletedWorkouts] = useState(0);
    const [numOfWorkouts,setNumOfWorkouts] = useState(0);
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday","Friday", "Saturday", "Sunday"];
    let uid = auth.currentUser.uid;

    const getCompletedWorkouts = async() => 
    {
        let numOfCompletedWorkouts = 0;
        let numWorkouts = 0;
        for (let i = 0; i < days.length; i++)
        {
            let workoutData = {};
            const workoutDocRef = doc(db, "users", uid, "workouts", days[i])
            const docSnap = await getDoc(workoutDocRef);

            if(docSnap.exists())
            {
               workoutData = docSnap.data();
                if(workoutData.completed == true && workoutData.name != "default name")
                {
                    numOfCompletedWorkouts++;
                }
                if(workoutData.restday === false)
                {
                    //this is a workout regardless of being completed
                    numWorkouts++;
                }
            }
        }
        //setCompletedWorkouts(numOfCompletedWorkouts)
        setCompletedWorkouts(1)
        console.log("got completed workouts: ", completedWorkouts)
        setNumOfWorkouts(numWorkouts)
        console.log("number of workouts: ", numOfWorkouts)
    }
    const setData = () =>
    {
        
            if(numOfWorkouts === 0 || completedWorkouts == 0)
            {
                setProgressPercent(0)
            }
            else
            {
                const percentage = (completedWorkouts/numOfWorkouts)* 100;
                setProgressPercent(percentage.toFixed(0))
                
            }
            /*if (radialProgressRef.current)
            {
                const val = `${progressPercent}%`;
                radialProgressRef.current.style.setProperty("--progress", val);
                radialProgressRef.current.textContent = val;
            }
            */
    }
    /*useEffect(() => {
        const setupPage = async () => {
          setLoading(true);  // Set loading to true while fetching data
          await getCompletedWorkouts();  // Wait for data fetching to complete
          setData();  // Set progress bar data
          setLoading(false);  // Set loading to false once data is processed
        };
        setupPage();
      }, [progressPercent]);*/
      useEffect(() => {
        setLoading(true)
        if (completedWorkouts !== null && numOfWorkouts !== null) {
          setData();
        }
        setLoading(false)
      }, [completedWorkouts, numOfWorkouts]); // Trigger only when data is updated
    
      useEffect(() => 
      {
        setLoading(true)
        getCompletedWorkouts(); // Fetch data when component mounts
        setLoading(false)
      }, []);
    
      useEffect(() => {
        setLoading(true)
        if (radialProgressRef.current) {
          const val = `${progressPercent}%`;
          radialProgressRef.current.style.setProperty("--progress", val);
          radialProgressRef.current.textContent = val;
        }
        setLoading(false)
      }, [progressPercent]);
    return(
        <div className="progress-bar-container">
            <div className="left-side">
                <h3 id="progress-title">Workout Progress</h3>
                <p id="progress-subtitle">5 Exercise left</p>
            </div>
            <div className="right-side">
            {loading ? (
                <div className="loading-section">
                    <p>Loading...</p> {/* You can replace this with a spinner or animation */}
                </div>
                ) : (  
                    <div
                        ref={radialProgressRef} 
                        className="RadialProgress" 
                        role="progressbar" 
                        aria-valuenow={progressPercent} 
                        aria-valuemin="0" 
                        aria-valuemax="100">
                            {progressPercent}%
                    </div>
                 )}
           
            </div>
        </div>
    );
};