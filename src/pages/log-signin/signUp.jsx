import "../../styles/signUp.css"
import logo from '../../assets/exercise.png'; 
import {useForm} from "react-hook-form";
import {auth,db} from "../../config/firebase";
import {setDoc,doc} from 'firebase/firestore';
import {createUserWithEmailAndPassword } from "firebase/auth";
import {useNavigate} from "react-router-dom";
export const SignUp = () =>
{
    const navigate = useNavigate();
    const{register, handleSubmit,} = useForm();

    const onSignUp = async(data) =>
    {
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
          // Signed up 
          //grab db
          //const userRef = collection(db, "users", userCredential.user.uid);
          //create the user in users db
          //console.log(userCredential.user.providerData.);
          setDoc(doc(db, "users", userCredential.user.uid),
          {
            
            Name: data.name, 
            Email: data.email,
            Age: 0,
            userId: userCredential.user.uid,
            NumWorkouts: 4,
            Sex: "",

            });
            //successfully adds user to Users db and sends them to profile to add to profile. 
            navigate("/");
            
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