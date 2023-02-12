import { createContext, useEffect, useState } from "react";
import { User } from "firebase";

import firebaseService from "../services/firebase";

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [currentUser,setCurrentUer] = useState<User>(null);
    const [isLoaded,setIsLoaded] = useState<Boolean>(false);

    useEffect(()=>{
        firebaseService.auth.onAuthStateChanged(user=>{
            setCurrentUer(user);
            setIsLoaded(true);
        })
    },[currentUser]);
    return(
        <AuthContext.Provider value={{currentUser,isLoaded}}>
            {children}
        </AuthContext.Provider>
    )

}