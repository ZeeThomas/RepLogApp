import "../../styles/signUp.css"
import logo from '../../assets/exercise.png'; 
import {useForm} from "react-hook-form";
import {auth,db} from "../../config/firebase";
import {setDoc,addDoc,doc, collection} from 'firebase/firestore';
import {createUserWithEmailAndPassword } from "firebase/auth";
import {useNavigate} from "react-router-dom";
export const SignUp = () =>
{
    const navigate = useNavigate();
    const{register, handleSubmit,} = useForm();
    const createWorkouts = async(cred) => 
    {
         /*const workoutDocRef = collection(db, "workouts");
         await workoutDocRef.doc(cred.user.uid).collection('exercises').doc().set({
            name: 'Monday',
            restday: true, 
            exercises: [],
            length: 0,
          });
          */
          const UserExerciseRef = doc(db, "users", cred.user.uid, "workouts", "Monday");
          await setDoc(UserExerciseRef, {
            day: 'Monday',
            restday: true, 
            exercises: [],
            length: 0,
          });
          const mondayExerciseRef = doc(db, "users", cred.user.uid, "workouts", "Monday");
          await setDoc(mondayExerciseRef, {
            day: 'Monday',
            restday: true, 
            exercises: [],
            length: 0,
          });
          const tuesdayExerciseRef = doc(db, "users", cred.user.uid, "workouts", "Tuesday");
          await setDoc(tuesdayExerciseRef, {
            day: 'Tuesday',
            restday: true, 
            exercises: [],
            length: 0,
          });
          const wednesdayExerciseRef = doc(db, "users", cred.user.uid, "workouts", "Wednesday");
          await setDoc(wednesdayExerciseRef, {
            day: 'Wednesday',
            restday: true, 
            exercises: [],
            length: 0,
          });
          const thursdayExerciseRef = doc(db, "users", cred.user.uid, "workouts", "Thursday");
          await setDoc(thursdayExerciseRef, {
            day: 'Thursday',
            restday: true, 
            exercises: [],
            length: 0,
          });
          const fridayExerciseRef = doc(db, "users", cred.user.uid, "workouts", "Friday");
          await setDoc(fridayExerciseRef, {
            day: 'Friday',
            restday: true, 
            exercises: [],
            length: 0,
          });
          const saturdayExerciseRef = doc(db, "users", cred.user.uid, "workouts", "Saturday");
          await setDoc(saturdayExerciseRef, {
            day: 'Saturday',
            restday: true, 
            exercises: [],
            length: 0,
          });
          const sundayExerciseRef = doc(db, "users", cred.user.uid, "workouts", "Sunday");
          await setDoc(sundayExerciseRef, {
            day: 'Sunday',
            restday: true, 
            exercises: [],
            length: 0,
          });
    }
    const onSignUp = async(data) =>
    {
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
          // Signed up 
          //grab db
          //const userRef = collection(db, "users", userCredential.user.uid);
          //create the user in users db
          //console.log(userCredential.user.providerData.);
          //creates a doc for them in Users
          setDoc(doc(db, "users", userCredential.user.uid),
          {
            
            Name: data.name, 
            Email: data.email,
            Age: 0,
            userId: userCredential.user.uid,
            NumWorkouts: 4,
            Sex: "",

            });
            //creates a doc for them in Workouts
            {createWorkouts(userCredential)};
          
            //successfully adds user to Users db and sends them to profile to add to profile. 
            navigate("/profile");
            
        })
        .catch((error) => {
            //figuring out error
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("error code", errorCode);
          console.log("error msg", errorMessage);
        });
    };
    return (
        <div className="signUpPage">
            <img className="logo" src={logo} alt="dumbell icon"/>
            <h2 className="title">RepLog</h2>
            <form className="signUpForm" onSubmit={handleSubmit(onSignUp)}>
            <p>Name</p>
            <input placeholder="Name" {...register("name", {required:true})} />
            <p>Email</p>
            <input placeholder="Email" {...register("email", {required:true})} />
            <p>Password</p>
            <input placeholder="Password" {...register("password", {required:true})} />
            <input className="submitButton" type="submit" value="Sign Up" />
           
        </form>
        </div>
    );
};