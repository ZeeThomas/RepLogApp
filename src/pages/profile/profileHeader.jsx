import "../../styles/profile.css";
import profileImage from "../../assets/account_circle.svg";
import settingCog from '../../assets/manufacturing.png';
import workoutIcon from '../../assets/azm.png';
import rewardIcon from '../../assets/award_star.png';
import { useContext, useState } from "react";
import {UserContext} from "../../App";

export const ProfileHeader = ({user, onSectionChange}) => 
{
    return (
        <div className="top-portion background">
            <img src={profileImage} alt="profile"/>
            {console.log("the user is", user.name)}
            <h2>{user.name}</h2>
            <h2>{user.age}</h2>
            <div className="navigation">
                <button className="account-button navigation-button" onClick={() => onSectionChange("account")}>Account<img src={settingCog} alt="settings icon"/></button>
                <button className="workout-button navigation-button"onClick={() => onSectionChange("workouts")}>Workouts<img src={workoutIcon} alt="settings icon"/></button>
                <button className="reward-button navigation-button" onClick={() => onSectionChange("rewards")}>Rewards<img src={rewardIcon} alt="settings icon"/></button>
            </div>
        </div>
       
    );
};
