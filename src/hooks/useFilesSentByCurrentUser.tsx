import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import firebaseService from "../services/firebase";
import { FileData } from "../types/FileData";

export const useFilesSentByCurrentUser = () => {
    const { currentUser } = useContext(AuthContext);
    const [files, setFiles] = useState<FileData[]>([]);

    const fetchData = async () => {
        setFiles(await firebaseService.getFilesSentByCurrentUser());
    }

    useEffect(() => {
        if (currentUser) {
            fetchData();
        }
    }, [currentUser]);

    return {currentUser, files};
}