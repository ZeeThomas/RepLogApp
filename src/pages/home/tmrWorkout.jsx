import "../../styles/tmrWorkout.css";
export const TmrWorkout = (props) =>
{
    const {workoutTmr} = props;
    const restday = workoutTmr.restday;
    const displayWorkout = () => 
    {
        if(workoutTmr.exercises.length === 0)
        {
            //empty exercises 
            console.log("not a restday")
            return (
                <div>
                    <h3>You're missing your exercises</h3>
                    <p>Add exercises or change to restday</p>
                </div>
            )
        }
        else 
        {
            console.log("The name of tmrs workout", workoutTmr.workoutName)
            return (
                <div>
                    <h3 id="tmr-workout-name">{workoutTmr.workoutName} Day</h3>
                </div>
            )

        }
    }
    const displayRestDay = () =>
    {
        return (
            <div className="rest-day-display-container">
                <h3>Rest Day</h3>
                <p>"Muscles are torn in the gym, fed in the kitchen, and built in bed"</p>
            </div>
        )
    }
    return(
        <div>
            <h1>Tomorrow...</h1>
            {console.log("This is the workout for tmr", workoutTmr)}
            {restday == true? (displayRestDay()) : (displayWorkout())}
        </div>
    );

}