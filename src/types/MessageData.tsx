import { Timestamp } from "firebase/firestore";
import { FileData } from "./FileData";


export type MessageData = {
    id: string,
    content: string,
    senderId: string|null,
    file: FileData|null,
    timestamp: Timestamp,
    isRead: boolean
};
