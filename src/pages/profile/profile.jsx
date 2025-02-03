import "../../styles/profile.css";
import profileImage from "../../assets/account_circle.svg";
import settingCog from '../../assets/manufacturing.png';
import workoutIcon from '../../assets/azm.png';
import rewardIcon from '../../assets/award_star.png';
import {ProfileHeader} from "../profile/profileHeader"
import {ProfileAccount} from "../profile/profile-account"
import {ProfileWorkouts} from "../profile/profile-workouts"
import {NavigationBar} from "../navigationBar"
import { useContext, useState } from "react";
import {UserContext} from "../../App";

export const Profile = () =>
{
    const {user}= useContext(UserContext);
    const [section, setSection] = useState("account");
   const displaySection= () =>
   {
        if (section === "account")
        {
        return <ProfileAccount />
        }
        else if (section === "workouts")
        {
        return <ProfileWorkouts />
        }
        else if (section === "rewards")
        {
            return <h2>rewards</h2>

        }
   };
    return (
        <div className="profile-container background">
          {/*console.log("Profile is sending user as", user)*/}
          <ProfileHeader user={user} onSectionChange={setSection}/>
          <div className="bottom-portion">
            {displaySection()}
          </div>
          <div className="bar">
            <NavigationBar 
            page="profile" />
          </div>
        </div>
         
    );
};