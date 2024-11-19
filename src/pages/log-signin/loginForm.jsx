import {useForm} from "react-hook-form";
import {app} from "../../config/firebase";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
export const LoginForm = () => 
{
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
        }
        catch(err)
        {
            console.log(err);
        }
    };
    return (
        <div className="loginForm">
        <h2>RepLog</h2>
        <form onSubmit={handleSubmit(OnLogin)}>
          <input placeholder="Email" {...register("email", {required:true})} />
          <input placeholder="Passwrod" {...register("password", {required:true})} />
          <input type="submit" />
        </form>
    </div>
    );
}