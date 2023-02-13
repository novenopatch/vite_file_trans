import  { FormEvent,ChangeEvent, useState,useContext, useEffect } from 'react';
import { Card, ListGroup, ListGroupItem,Button, Form } from "react-bootstrap"
import Swal from 'sweetalert2';
import { MessageData } from "../types/MessageData";
import firebaseService from "../services/firebase";
import { AuthContext } from "../context/AuthContext";



const Message = () => {
    const { currentUser } = useContext(AuthContext);
    const [messages, setMesages] = useState<MessageData[]>([]);
    const [text, setText] = useState("");
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if (!text) return;
        firebaseService.addMessage(text,null);
        setText("");
        Swal.fire({
            icon: 'success',
            text: 'Succes,your message is up to server !',
            title: "All is right"
        });
        fetchData();
    }    

    const fetchData = async () => {
        setMesages(await firebaseService.getMessagesSentByCurrentUser());
    }
    useEffect(() => {
        fetchData();
    }, [currentUser]);
    return (
        <>
         <Card>
            <Card.Header>Send new Message</Card.Header>
            <Card.Body>
                <Form  onSubmit={handleSubmit} >
                    <Form.Control
                     className='mb-3' 
                     type='text' 
                     required 
                     value={text}
                        onChange={(e) => setText(e.target.value)} placeholder='Enter your message'/>
                    <Button className='w-100' type="submit">Send Message</Button>
                </Form>
            </Card.Body>
        </Card>
         <Card>
             <Card.Header>Messages sent</Card.Header>
            <ListGroup className="list-group-flush">
                {0 === messages.length
                    ? <ListGroupItem></ListGroupItem>
                    : messages.map((doc, key) => {
                        return <ListGroupItem action key={key} >{doc.content}</ListGroupItem>
                    })
                }
            </ListGroup>
        </Card>
        </>
       
    );
};

export default Message;