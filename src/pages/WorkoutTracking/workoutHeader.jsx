import "../../styles/workoutHeader.css";
/*Assets */
import addIcon from "../../assets/add.png";
import calendar from "../../assets/calendar_today.png";
import clock from "../../assets/alarm.png";
import weight from "../../assets/exercise.png";
/*other imports */
import { useState, useEffect, useCallback} from "react";
import React, {useRef} from "react";
import {useNavigate} from "react-router-dom";


export const WorkoutHeader = ({workoutName,
    day,
    time,
    restDay,
    numExercises,
    updateHeaderData,}) =>
{    
    
    //const { workoutName, day, time, restDay, numExercises} = props;
    const navigate = useNavigate();
    let initialData = {
        workoutName: workoutName,
        lengthOfExercise: time, 
        restDay: restDay,
    }
    console.log("rest day is initialized as ", initialData.restDay)
    const [headerData, setHeaderData] = useState(initialData);
    const [rest, setRest] = useState(restDay);
    const nameRef = useRef();
    const lengthRef = useRef();
    //numOfWorkouts = 0;
    //console.log(restDay);
    /*useEffect(() => {
        setHeaderData(
            {
                workoutName, 
                lengthOfExercise: time,
                restDay,
            }
        );
        setRest(restday);
    },[workoutName, time, restDay]); */
   const handleChange = (field, value) =>
   {

        console.log("the field and value is ", field," ", value);
        const updatedData = {...headerData, [field]: value};
        setHeaderData(updatedData);
        if (updateHeaderData)
        {
            updateHeaderData(updatedData);
        }
   }
   const addExercise = () =>
    {
        const workoutData = {day: day};

        navigate('/addExercise',{ state: { workoutData } });
    }
    const  handleToggle = () =>
    {
        //changes the State var for the rest day
        const newRest = !rest;
        setRest(newRest);
        handleChange("restDay", newRest)
        console.log("Rest is", newRest);
        
    }
  return (
        <div className= "workoutHeaderContainer">
            <input type="text" id="name" value={headerData.workoutName} className="workoutName" onChange ={(e) => handleChange("workoutName", e.target.value)} Blur={(e) => handleChange("workoutName", e.target.value)} />
            <div className="workoutHeader-info-row">
                <div className="header-info">
                <img src={calendar} alt="calendar icon" />
                <p>{day}</p>
                </div>
                <div className="header-info">
                <img  src={clock} alt="clock icon" />
                <input type="text"  id="time" value={headerData.lengthOfExercise} className="workoutLength" onChange ={(e) => handleChange("lengthOfExercise", e.target.value)} onBlur={(e) => handleChange("lengthOfExercise", e.target.value)} /><p>minutes</p>
                </div>
                <div className="header-info">
                <img src={weight} alt="dumbell icon" />
                <p>{numExercises}</p>
                <button onClick={addExercise}id="addIcon"><img src={addIcon}  alt="add icon" /></button>
                </div>
            </div>
            <div className="rest-day-area">
            <p>Rest Day?</p>
            <label className= "toggle">
                <input type="checkbox"
                checked={rest}
                onChange={handleToggle}//this updates the state when the toggle is clicked
                />
                <span class="slider round"></span>
            </label>
            </div>
        </div>
    );
}