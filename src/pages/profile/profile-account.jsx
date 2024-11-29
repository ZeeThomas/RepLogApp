import "../../styles/profile.css";

import {useForm} from "react-hook-form";
import { useContext, useState } from "react";
import {UserContext} from "../../App";
import {getAuth} from "firebase/auth";
import {setDoc,doc} from 'firebase/firestore';
import {auth, provider,db} from "../../config/firebase";
export const ProfileAccount = () => 
{
    const {user, setUser}= useContext(UserContext);
    const{register, handleSubmit,} =useForm();
    const auth = getAuth();
    const firebaseUser = auth.currentUser;
    const OnUpdate = async(data) =>
    {
        setDoc(doc(db, "users", firebaseUser.uid),
          {
            
            Name: data.name, 
            Email: data.email,
            Age: data.age,
            NumWorkouts: data.numWorkouts,
            Sex: data.sex,

            });

        setUser({name:data.name, age:data.age, numWorkouts:data.numWorkouts, sex:data.sex});
    };
    return(
        

        <form className="account-info-form background" onSubmit={handleSubmit(OnUpdate)}>
            <p>Name</p>
            <input type="text" defaultValue={user.name} {...register("name", {required:true})}/>
            <p>Email</p>
            <input type="text" defaultValue={firebaseUser.email} {...register("email", {required:true})}/>
            <p>Age</p>
            <input type="text" defaultValue={user.age} {...register("age", {required:true})}/>
            <p>Number of Workouts</p>
            <input type="text" defaultValue={user.numWorkouts} {...register("numWorkouts", {required:true})}/>
            <p>Sex</p>
            <input type="text" defaultValue={user.sex} {...register("sex", {required:true})}/>
            <input  className="submitButton" type="submit" value="Submit" />
        </form>
    );
};