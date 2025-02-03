import "../../styles/todaysWorkout.css";
import {useNavigate} from "react-router-dom";

export const TodaysWorkout = (props) => 
{
    const {workoutToday} = props;
    const navigate = useNavigate();
    const exerciseList = workoutToday.exercises || [];
    const numOfExercises = workoutToday.exercises.length;
    const getFive = () => 
    {
        if(numOfExercises > 5)
        {
            exerciseList =workoutToday.exercises.slice(0,5)
            //console.log("less than 5", exerciseList)

        }

    }
    return(
        <div className="today-workout-container">
            {/*console.log("recieved this from home", workoutToday)*/}
            <h1>{workoutToday.workoutName}</h1>
            <div className="workout-container">
                <div className="workout-breakdown">
                    <div className="exercise-amount">
                        <p className="info">{numOfExercises}</p>
                        <p>Exercises</p>
                    </div>
                    <div className="length-workout">
                        <p className="info">{workoutToday.length}</p>
                        <p>Minutes</p>
                    </div>
                </div>
                <div className="show-info">
                    <div className="list">
                    {getFive()}
                    {exerciseList && exerciseList.length > 0?
                    (
                        exerciseList.map((exerciseList, index) => (
                            /*The info needs to be sent to the card. Name, sets, reps, weight. */
                            
                        <div className="card">
                                <p className="workoutTitle">{exerciseList.name}</p>
                                <p className="amounts">{exerciseList.reps}x{exerciseList.set}</p>
                            </div>
                        ))
                    ): (
                        <div className="no-workouts-container">
                            <p>No Exercises</p>
                        </div>
                    )}
                    </div>
                    <div className="show-more">
                        {/*This is going to turn to a button to send to workoutpage */}
                        <btn className="see-workout-btn" onClick={()=>navigate("/startWorkout")}>See Full Workout</btn>
                    </div>
                </div>
              
            </div>
        </div>
    );

}