/*Style */
import "../styles/navigationBar.css";
/*Icon imports */
import homeIcon from "../assets/home.png";
import dumbbellIcon from "../assets/fitness_center.png";
import person from "../assets/person.png";
/*Other fun stuff */
import {Link} from "react-router-dom";

export const NavigationBar = (props) => 
{
    const {page} = props;
    const isActive = (area) => 
    {
        if (area === page)
        {
            //console.log("the area is ", area, "the page is ", page)
            return true;
        }
        else
        {
            return false;
        }
    }
    return (
        <div className="bar-container">
            <div className={`element home ${isActive("home")? "active": ""}`}>
                <Link to="/home" >
                    <img src={homeIcon}/>
                    <p>Home</p>
                </Link>
            </div>
            <div className={`element workout ${isActive("workout")? "active": ""}`}>
                <Link to="/startWorkout">
                    <img src={dumbbellIcon}/>
                    <p>Workout</p>
                </Link>
            </div>
            <div className={`element profile ${isActive("profile")? "active": ""}`}>
                <Link to="/profile" >
                    <img src={person}/>
                    <p>Profile</p>
                </Link>
            </div>
        </div>
    );
}