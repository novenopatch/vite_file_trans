import {initializeApp} from "firebase/app";
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";
import { collection, CollectionReference, Firestore, getFirestore } from "firebase/firestore";
import {FirebaseStorage, getStorage} from "firebase/storage"
import config from "./config.json";

export type FileData = {
    id: string,
    originalFIlename: string,
    uniqueFuleName: string,
    userId: string|null
}
export type UserData = {
    displayName : string,
    uid : string
}
class FirebaseService{
    auth: Auth;
    firestore: Firestore;
    filesCollection: CollectionReference<FileData>;
    googleAuthProvider: GoogleAuthProvider;
    storage : FirebaseStorage;
    userCollection: CollectionReference<UserData>;
    constructor(){
        initializeApp(config)
        this.auth = getAuth();
        this.auth.useDeviceLanguage();
        this.firestore = getFirestore();
        this.filesCollection = collection(this.firestore,'files') as CollectionReference<FileData>;
        this.googleAuthProvider = new GoogleAuthProvider();
        this.storage = getStorage();
        this.userCollection = collection(this.firestore,'users') as CollectionReference<UserData>;
    }
}
export default new FirebaseService();