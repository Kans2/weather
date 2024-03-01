import './../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Login from './Components/Login.js';
import Home from './Components/Home.js';
import './App.css';

function App() {
  return (
    <div className='App'>
  <BrowserRouter>
   <Routes>
    <Route path='/' element={<Login/>}/>
    <Route path='/home' element={<Home/>}/>
   </Routes>
  
  </BrowserRouter>
   </div>
  );
}

export default App;
