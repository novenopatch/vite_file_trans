import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import {Route,Routes,BrowserRouter} from 'react-router-dom'
import './App.scss';
import { Container,Col } from 'react-bootstrap' 
import Navigation from './components/Navigation'
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const File = lazy(() => import("./pages/File"));
const FileRequest = lazy(() => import("./pages/FileRequest"));
const Sent = lazy(() => import("./pages/Sent"));
function App() {

  return (
    <AuthProvider>
          <BrowserRouter>
              <Navigation/>
              <Container>
                <Col xl={{span:6,offset:3}} >
                  <Routes>
                      <Route path="/" element={<Suspense> <Home/></Suspense>}/>
                      <Route path="/files" element={<Suspense> <FileRequest/></Suspense>}/>
                      <Route path="/files/:id" element={<Suspense> <File/></Suspense>}/>
                      <Route path="/sent" element={<Suspense> <Sent/></Suspense>}/>
                      <Route path="*" element={<Suspense> <Home/></Suspense>}/>
                  </Routes>
                </Col>

            </Container>
          </BrowserRouter>
    </AuthProvider>
    
    
    
  )
}

export default App
