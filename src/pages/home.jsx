import {UserContext} from "../App.js"
import { useContext } from "react";
export const Home = () => 
{
    const {user} = useContext(UserContext);
    return <div><h1>main page</h1><h2>Hello, {user.name}</h2></div>
};