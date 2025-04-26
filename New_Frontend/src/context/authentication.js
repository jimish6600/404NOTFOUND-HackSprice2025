import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
export const StoreContext =createContext(null)



const StoreContextProvider = (props) =>{

    const [userName,setUserName] = useState("");
    const [currectLogin,setCurrectLogin] = useState(false)
    
    useEffect(()=>{
        const fetchUserDetails = async () => {

          try {
            // authToken = localStorage.getItem('authToken');
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/userDetails`,
              {
                headers: {
                  authorization: localStorage.getItem('authToken'), // Add Authorization header
                },
              }
            );
            const dataApi = response.data;
            console.log(dataApi)
            if(dataApi.success){
              setUserName(dataApi.userName)
              setCurrectLogin(true)
            }
          } catch (error) {
            toast.error('Error fetching quizzes');
          }
        }
        fetchUserDetails();
    },[])
    const contextValue = {
        userName,
        currectLogin,
        setCurrectLogin,
        setUserName,
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;