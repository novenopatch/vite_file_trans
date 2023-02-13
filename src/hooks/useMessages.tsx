import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { MessageData } from "../types/MessageData";
import firebaseService from "../services/firebase";


export const useMessages = () =>{
    const { currentUser } = useContext(AuthContext);
    const [messages, setMesages] = useState<MessageData[]>([]);
    const fetchData = async () => {
        setMesages(await firebaseService.getMessagesSentByCurrentUser());
    }
    useEffect(() => {
        fetchData();
    }, [currentUser]);
    return {currentUser, messages};
}