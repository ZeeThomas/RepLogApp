import "../../styles/loginForm.css"
import { useContext, useEffect } from "react";
import google_logo from '../../assets/google_logo.png'
import logo from '../../assets/exercise.png'; // Tell webpack this JS file uses this image
import {useForm} from "react-hook-form";
import {auth, provider,db} from "../../config/firebase";
import {doc, setDoc,getDoc} from "firebase/firestore";
import {signInWithRedirect,getRedirectResult,getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
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
            //console.log(data);
            signInWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) =>{
                //add this info to global state information
                const Cred = userCredential;
                
            });
            await establishUser();
            //console.log("success!");
            navigate("/home");
        }
        catch(err)
        {
            //console.log(err);
        }
        
    };
    const createWorkouts = async(uid) => 
    {
         /*const workoutDocRef = collection(db, "workouts");
         await workoutDocRef.doc(cred.user.uid).collection('exercises').doc().set({
            name: 'Monday',
            restday: true, 
            exercises: [],
            length: 0,
          });
          */
          const UserExerciseRef = doc(db, "users", uid, "workouts", "Monday");
          await setDoc(UserExerciseRef, {
            day: 'Monday',
            restday: true, 
            exercises: [],
            length: 0,
            completed: false,
            name: 'Monday Workout'
          });
          const mondayExerciseRef = doc(db, "users", uid, "workouts", "Monday");
          await setDoc(mondayExerciseRef, {
            day: 'Monday',
            restday: true, 
            exercises: [],
            length: 0,
            completed: false,
            name: 'Monday Workout',
          });
          const tuesdayExerciseRef = doc(db, "users", uid, "workouts", "Tuesday");
          await setDoc(tuesdayExerciseRef, {
            day: 'Tuesday',
            restday: true, 
            exercises: [],
            length: 0,
            completed: false,
            name: 'Tuesday Workout',
          });
          const wednesdayExerciseRef = doc(db, "users", uid, "workouts", "Wednesday");
          await setDoc(wednesdayExerciseRef, {
            day: 'Wednesday',
            restday: true, 
            exercises: [],
            length: 0,
            completed: false,
            name: 'Wednesday Workout',

          });
          const thursdayExerciseRef = doc(db, "users", uid, "workouts", "Thursday");
          await setDoc(thursdayExerciseRef, {
            day: 'Thursday',
            restday: true, 
            exercises: [],
            length: 0,
            completed: false,
            name: 'Thursday Workout',

          });
          const fridayExerciseRef = doc(db, "users", uid, "workouts", "Friday");
          await setDoc(fridayExerciseRef, {
            day: 'Friday',
            restday: true, 
            exercises: [],
            length: 0,
            completed: false,
            name: 'Friday Workout',
          });
          const saturdayExerciseRef = doc(db, "users", uid, "workouts", "Saturday");
          await setDoc(saturdayExerciseRef, {
            day: 'Saturday',
            restday: true, 
            exercises: [],
            length: 0,
            completed: false,
            name: 'Saturday Workout',
          });
          const sundayExerciseRef = doc(db, "users", uid, "workouts", "Sunday");
          await setDoc(sundayExerciseRef, {
            day: 'Sunday',
            restday: true, 
            exercises: [],
            length: 0,
            completed: false,
            name: 'Sunday Workout',

          });
    }
    const signInWithGoogle = async() =>
    {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth,provider).then(async(result)=>
        {
            const uid = result.user.uid;
            //console.log(result.user.displayName)
            const userDocRef = doc(db, "users", uid);
            const docSnap = await getDoc(userDocRef);
            if(docSnap.exists())
            {
                setUser({name:docSnap.data().Name, numWorkouts:docSnap.data().NumWorkouts, age:docSnap.data().Age, sex:docSnap.data().Sex,})
                navigate("/home")
            }
            else
            {
                //create the users account
                setDoc(doc(db, "users", uid),
                {
                  
                  Name: result.user.displayName, 
                  Email: result.user.email,
                  Age: 0,
                  userId: uid,
                  NumWorkouts: 4,
                  Sex: "",
      
                });
                  //creates a doc for them in Workouts
                {createWorkouts(uid)};
                await establishUser();
                  //successfully adds user to Users db and sends them to profile to add to profile. 
                navigate("/profile");
            }
           
        })

        
    };
    const establishUser = async() =>
    {

        const uid = auth.currentUser.uid;
        //get the document
        //console.log(uid);
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
            //console.log("Updated user context:", user.name);
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
            <button className="googleAuthButton" onClick={signInWithGoogle}><img src={google_logo}/>Login with Google</button>
            <input className="submitButton" type="submit" value="Login" />
            <p className="signUpText">Don't have an account yet? <a className="signUpLink"href="/signUp">Sign Up</a></p>
        </form>
        
    </div>
    );
}