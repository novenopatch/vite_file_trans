import {initializeApp} from "firebase/app";
import config from "./config.json";
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup, signOut, User, UserCredential } from "firebase/auth";
import { collection, CollectionReference, doc, Firestore, getDoc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { FirebaseStorage, getStorage, ref, uploadBytesResumable, UploadTask } from "firebase/storage";
import { uuidv4 } from '@firebase/util';
import { customAlphabet } from "nanoid";

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
    usersCollection: CollectionReference<UserData>;
    constructor(){
        initializeApp(config)
        this.auth = getAuth();
        this.auth.useDeviceLanguage();
        this.firestore = getFirestore();
        this.filesCollection = collection(this.firestore,'files') as CollectionReference<FileData>;
        this.googleAuthProvider = new GoogleAuthProvider();
        this.storage = getStorage();
        this.usersCollection = collection(this.firestore,'users') as CollectionReference<UserData>;
    }
    async addUser(user: User): Promise<void> {
        await setDoc(doc(this.usersCollection, user.uid), {
            uid: user.uid,
            displayName: user.displayName
        });
    }
    async signInWithGoogle(): Promise<UserCredential>{
        try{
                const userCredential = await signInWithPopup(this.auth,this.googleAuthProvider);
        } catch(error){
            return null;
        }
    }
    async signOut(): Promise<void> {
        await signOut(this.auth);
    }
    async getSingleUser(uid: string): Promise<UserData> {
        const userData = await getDoc(doc(this.usersCollection, uid));

        return userData.data();
    }

    getCurrentUser(): User | null {
        return this.auth.currentUser;
    }

}
export default new FirebaseService();