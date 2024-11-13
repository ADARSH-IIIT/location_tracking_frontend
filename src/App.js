import { BrowserRouter , Route , Routes} from 'react-router-dom'

import './App.css'


import Auth from './components/Auth/Auth';




import Apppage from './pages/Apppage';
// import { AppBar } from '@mui/material';

import Welcome from './components/welcome/Welcome';

import Chat_profile from './components/location_profile/Location_profile';
import LandingPage from './pages/Landing_page';


function App() {
  return (
  
    <div className='app'>
    <BrowserRouter  >

             {/* <div>always fix header</div> */}
             <Routes  >
                
                < Route  path='/auth'   element = { < Auth/> }  > </Route>
                  
            
                  <Route path = '/' element = {<LandingPage/>}  ></Route>

                  < Route  path='/app/welcome'   element = { <Apppage  Child={Welcome}   /> }   > </Route>
                  < Route  path='/app/chat/:receiverid'   element = { <Apppage  Child={ Chat_profile }   /> }   > </Route>
                

            </Routes>







            
          
             {/* <div>alwauys fix footer</div> */}
    </BrowserRouter>



    </div>
    
  
  );
}

export default App;
