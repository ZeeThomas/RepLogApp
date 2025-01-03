import "../../styles/loginForm.css"
import { useContext, useEffect } from "react";
import logo from '../../assets/exercise.png'; // Tell webpack this JS file uses this image
import {useForm} from "react-hook-form";
import {auth, provider,db} from "../../config/firebase";
import {doc, getDoc} from "firebase/firestore";
import {getAuth, signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import { UserContext } from "../../App";
export const LoginForm = () => 
{
    const {user,setUser} = useContext(UserContext)
    const navigate = useNavigate();
    const{register, handleSubmit,} =useForm();
    const OnLogin = async(data) =>
    {
        try
        {
            const auth = getAuth();
            console.log(data);
            signInWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) =>{
                //add this info to global state information
                const Cred = userCredential;
                
            });
            await establishUser();
            console.log("success!");
            navigate("/");
        }
        catch(err)
        {
            console.log(err);
        }
        
    };
    const signInWithGoogle = async(data) =>
    {
        const result = await signInWithPopup(auth, provider);
        navigate("/");
    };
    const establishUser = async() =>
    {

        const uid = auth.currentUser.uid;
        //get the document
        console.log(uid);
        const userDocRef = doc(db, "users", uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists())
        {
            setUser({name:docSnap.data().Name, numWorkouts:docSnap.data().NumWorkouts, age:docSnap.data().Age, sex:docSnap.data().Sex,});
        } 
        else
        {
            /*this is a vulnerability issue because a user 
            shouldn't be able to authenticate/login without 
            having a document in my user db*/
        }

    };
    useEffect(() =>
    {
        if (user)
        {
            console.log("Updated user context:", user.name);
        }
    }, [user]);
    return (
        <div className="loginFormPage">
        <img className="logo" src={logo} alt="dumbell icon "/>
        <h2 className="title">RepLog</h2>
        <form className="loginForm" onSubmit={handleSubmit(OnLogin)}>
            <p>Email</p>
            <input placeholder="Email" {...register("email", {required:true})} />
            <p>Password</p>
            <input placeholder="Password" {...register("password", {required:true})} />
            <button className="googleAuthButton" onClick={signInWithGoogle}>Login with Google</button>
            <input className="submitButton" type="submit" value="Login" />
            <p className="signUpText">Don't have an account yet? <a className="signUpLink"href="/signUp">Sign Up</a></p>
        </form>
        
    </div>
    );
}