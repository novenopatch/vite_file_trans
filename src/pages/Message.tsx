import React, { FormEvent,ChangeEvent, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { MessageData } from '../types/MessageData';
import { Card, ListGroup, ListGroupItem,Button, Form } from "react-bootstrap"
import { useMessages } from '../hooks/useMessages';
import firebase from '../services/firebase';
import Swal from 'sweetalert2';


const Message = () => {
    const { messages } = useMessages();
    const [text, setText] = useState("");
    const handleSubmit = (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if (!text) return;
        firebase.addMessage(text,null);
        setText("");
        Swal.fire({
            icon: 'success',
            text: 'Succes,your message is up to server !',
            title: "All is right"
        })
    }    
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