import { useLocation } from 'react-router-dom';
export const AddWorkout = () =>
{
    const location = useLocation();
    const { day, id} = location.state || {};
    return(
        <div>
        <h2>{day}</h2>
        
        </div>
    );
};