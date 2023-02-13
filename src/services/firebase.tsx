import {initializeApp} from "firebase/app";
import { orderBy, Timestamp } from "firebase/firestore";
import config from "./config.json";
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup, signOut, User, UserCredential } from "firebase/auth";
import { collection, CollectionReference, doc, Firestore, getDoc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { FirebaseStorage, getStorage, ref, uploadBytesResumable, UploadTask } from "firebase/storage";
import { uuidv4 } from '@firebase/util';
import { customAlphabet } from "nanoid";
import { FileData } from "../types/FileData";
import { UserData } from "../types/UserData";
import { MessageData } from "../types/MessageData";




class FirebaseService{
    auth: Auth;
    firestore: Firestore;
    filesCollection: CollectionReference<FileData>;
    googleAuthProvider: GoogleAuthProvider;
    storage : FirebaseStorage;
    usersCollection: CollectionReference<UserData>;
    messagesCollection: CollectionReference<MessageData>;
    constructor(){
        initializeApp(config)
        this.auth = getAuth();
        this.auth.useDeviceLanguage();
        this.firestore = getFirestore();
        this.filesCollection = collection(this.firestore,'files') as CollectionReference<FileData>;
        this.googleAuthProvider = new GoogleAuthProvider();
        this.storage = getStorage();
        this.usersCollection = collection(this.firestore,'users') as CollectionReference<UserData>;
        this.messagesCollection = collection(this.firestore,'messages') as CollectionReference<MessageData>;
    }
    async addUser(user: User): Promise<void> {
        await setDoc(doc(this.usersCollection, user.uid), {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email
        });
    }
    async addMessage(content: string,file:FileData|null): Promise<string> {
        const id = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)().toUpperCase();
        await setDoc<MessageData>(doc(this.messagesCollection, id), {
            id: id,
            content: content,
            senderId: this.auth.currentUser ? this.auth.currentUser.uid : null,
            file: file,
            timestamp: Timestamp.now(),
            isRead: false
        });

        return id;

    }
    async signInWithGoogle(): Promise<UserCredential>{
        try{
                const userCredential = await signInWithPopup(this.auth,this.googleAuthProvider);
                await this.addUser(userCredential.user)
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
    getUniqueFilename(file: File) {
        return `${uuidv4()}.${file.name.split('.').pop()}`;
    }

    uploadFile(file: File, filename: string): UploadTask {
        const storageRef = ref(this.storage, filename);

        return uploadBytesResumable(storageRef, file);
    }
    async addFile(originalFilename: string, uniqueFilename: string): Promise<string> {
        const id = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)().toUpperCase();

        await setDoc<FileData>(doc(this.filesCollection, id), {
            id: id,
            originalFilename: originalFilename,
            uniqueFilename: uniqueFilename,
            userId: this.auth.currentUser ? this.auth.currentUser.uid : null
        });

        return id;
    }
  
   
    async getMessagesSentByCurrentUser(): Promise<MessageData[]> {
      try {
        const q = query(this.messagesCollection, orderBy("timestamp", "asc"));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot) {
          return [];
        }

        const messages: MessageData[] = [];

        querySnapshot.docs.forEach(doc => {
          messages.push(doc.data());
        });

        return messages;
      } catch (error) {
        console.error(error);
        return [];
      }
}

    async getFilesSentByCurrentUser(): Promise<FileData[]> {
        const q = query(this.filesCollection, where('userId', '==', this.auth.currentUser.uid));
        const querySnapshot = await getDocs(q);

        const files: FileData[] = [];

        querySnapshot.docs.forEach(doc => {
            files.push(doc.data());
        })

        return files;
    }

    async getSingleFile(id: string): Promise<FileData> {
        const fileData = await getDoc(doc(this.filesCollection, id));
        return fileData.data();
    }

    

}
export default new FirebaseService();