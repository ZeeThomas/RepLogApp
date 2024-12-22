import "../../styles/exerciseCard.css";
import trashCan from "../../assets/delete.png";


export const ExerciseCard = (props) =>
{
    const {name,set, reps, weight,onDelete} = props;
   
    async function deleteCard()
    {
        if (window.confirm("Are you sure you want to delete this exercise?"))
        {
            onDelete({name:name, reps: reps, set: set, weight: weight})
        }
                   
          
    }
    return(
        /*This is for the way the card will be formatted */
        <div className="card-container">
            <div className="more-options">
            <img id="trash-can-icon" onClick={deleteCard}src={trashCan}/>
            </div>
            <div className="card-info">
                <h3>{name}</h3>
                <div className="small-text">
                    <p>{set} sets x {reps} reps</p>
                    <p>{weight} lbs</p>
                </div>
            </div>
        </div>
    );

}