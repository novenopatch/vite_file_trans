import { async } from '@firebase/util';
import React, { FormEvent,ChangeEvent, useState } from 'react';
import { Button, Card, Form, ProgressBar } from 'react-bootstrap';
import Swal from 'sweetalert2';
import firebaseService from "../services/firebase";

const Home = () => {
    const MAX_FILE_SIZE_IN_MB = 50;
    const [uploadProgresss,setUploadProgresss] = useState<number>(0);
    const [file,setFile] = useState<File>();
    const [validated,setValidated] = useState<boolean>(false);
    const [fileInputRef,setFileInputRef] = useState<HTMLInputElement>();
    const handleFileChange = ( e:ChangeEvent<HTMLInputElement>) =>{
        const files = e.target.files;
        if(null === files || files.length === 0) return;

        const fileSizeInMB = Number((files[0].size /(1048576)).toFixed(2));

        if(fileSizeInMB>= MAX_FILE_SIZE_IN_MB){
            Swal.fire({
                icon:'error',
                html:`The File size is up Max upload Size(${MAX_FILE_SIZE_IN_MB})`,
                title: 'Ooh Some Error'
            })
            return;
        }
        setFile(files[0]);
    }
    const handleSubmit = async ( e: FormEvent<HTMLFormElement> ) =>{
        e.preventDefault();
        if(!e.currentTarget.checkValidity()){
            setValidated(true)
            return;
        }
        const uniqueFilename = firebaseService.getUniqueFilename(file);
        const uploadTask = firebaseService.uploadFile(file,uniqueFilename);

        uploadTask.on('state_changed',(snapshot) => {
                setUploadProgresss(Math.round(snapshot.bytesTransferred / snapshot.totalBytes ) * 100);
        });
        const id = await firebaseService.addFile(file.name,uniqueFilename);
        setFile(null)
        fileInputRef.value= null;
        Swal.fire({
            footer: `<a href="/files/${id}">${id}</a>`,
            icon: 'success',
            text: 'Succes,your file is up to server !',
            title: "All is right"
        })

    }
    return (
        <Card>
            <Card.Header>Send An File</Card.Header>
            <Card.Body>
                <Form noValidate onSubmit={handleSubmit} validated={validated}>
                    <Form.Control className='mb-3' type='file' required onChange={handleFileChange} ref={setFileInputRef}/>
                    <Button className='w-100' type="submit">Get link</Button>
                    <ProgressBar animated className='mb-3' now={uploadProgresss} label={`${uploadProgresss}%`}/>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default Home;