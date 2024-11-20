import "../../App.css"
import logo from '../../assets/exercise.png'; // Tell webpack this JS file uses this image
import {useForm} from "react-hook-form";
import {app, auth, provider} from "../../config/firebase";
import {getAuth, signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import {useNavigate} from "react-router-dom";
export const LoginForm = () => 
{
    const navigate = useNavigate();
    const{register, handleSubmit,formState: {errors},} =useForm();
    const OnLogin = async(data) =>
    {
        try
        {
            const auth = getAuth();
            console.log(data);
            signInWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) =>{
                const user = userCredential.user;
            });
            console.log("success!");
            navigate("/")
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
    return (
        <div className="loginFormPage">
        <img className="logo" src={logo}/>
        <h2 className="title">RepLog</h2>
        <form className="loginForm" onSubmit={handleSubmit(OnLogin)}>
            <p>Email</p>
            <input placeholder="Email" {...register("email", {required:true})} />
            <p>Password</p>
            <input placeholder="Password" {...register("password", {required:true})} />
            <button className="googleAuthButton" onClick={signInWithGoogle}>Login with Google</button>
            <input className="submitButton" type="submit" value="Login" />
            <p className="signUpText">Don't have an account yet? <a className="signUpLink"href="/">Sign Up</a></p>
        </form>
        
    </div>
    );
}