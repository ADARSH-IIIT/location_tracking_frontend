import React, { useEffect, useState , useRef } from 'react'

import './Location_profile.css'
import { useParams } from 'react-router-dom';
import { useAlert } from 'react-alert'
import { useDispatch , useSelector } from 'react-redux';
import currentreceiver from '../../Redux/actionfunction/current_receiver';
import FrontEndSocket from '../../SOCKET/frontend_socket';


import { axiosinstance, backend_base_url } from '../../api_list';


import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";






const Chat_profile = () => {

console.log("////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ rerendering")

const dispatch = useDispatch()
 const alert = useAlert()
///////////////////////////////////////////////////  receiverid from url /////////////////////////////////////////////////////////////
            let { receiverid} = useParams()
         
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


 const [chat_id , setchatid] = useState()


/////////////////////////////////////////////////////////////////  myinfo and current receiverinfo//////////////////////////////////////////////////////
 const {myinfo} = useSelector((state)=>state.myinfo)
 const  x = useSelector((state)=>state.receiverinfo)
 const receiverinfo = x.currentreceiver
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







///////////////////////////
const [sendlocation , setsendlocation] = useState( true  )
const sendlocationbutton = document.querySelector('.send_location_button');
////////////////////////////////////////////////////////////////////////////////////////////////




function sendlocationtobackendsocket(){
   

  if(sendlocation){
    setsendlocation(false)
    sendlocationbutton.style.backgroundColor = 'green'
    sendlocationbutton.innerText = 'stop sharing location'
   if( sendlocationbutton?.classList?.contains('active')){
           sendlocationbutton.classList.add('active')
   }

    startLocationTracking()
   
    
  }

  else{
    console.log("this is running")
    setsendlocation(true)
    sendlocationbutton.style.backgroundColor = 'white'
    sendlocationbutton.innerText = 'start sharing location'


    if( !sendlocationbutton?.classList?.contains('active')){
      sendlocationbutton.classList.remove('active')
}

    stopLocationTracking()
   


  }

}
////////////////////////////////////////////////////////////////////////////////////////////////







useEffect(()=>{


  if(sendlocationbutton){
        sendlocationbutton.style.backgroundColor = 'white'
        sendlocationbutton.innerText = 'start sharing location'
  }



} , [chat_id])

////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////







const [ trackingInterval , settrackingInterval   ] = useState(null);
let previousPosition = null;

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
}

// Function to get current position
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
        }

        navigator.geolocation.getCurrentPosition(
            position => resolve(position),
            error => reject(error),
            { enableHighAccuracy: true }
        );
    });
}

// First function - Start tracking location
function startLocationTracking() {
   
    
    checkAndSendLocation();

    // Set interval for subsequent checks
    settrackingInterval ( setInterval(checkAndSendLocation, 3000)  ); // 10 seconds
}

// Helper function to check and send location
async function checkAndSendLocation() {
   
    
    try {
        const currentPosition = await getCurrentPosition();
        const currentLocation = {
            latitude: currentPosition.coords.latitude,
            longitude: currentPosition.coords.longitude,
            timestamp: new Date().toISOString()
        };


        setUserLocations(prev => ({
          ...prev,
          [myinfo?.username]: {
            position: [currentLocation.latitude, currentLocation.longitude],
            timestamp: currentLocation.timestamp
          },
        }));
        // If this is the first position, send it immediately
        if (!previousPosition) {
            console.log("sending location to backend for first time")
            emit_location( currentLocation )
            previousPosition = currentLocation;
            return;
        }

        // Calculate distance from previous position
        const distance = calculateDistance(
            previousPosition.latitude,
            previousPosition.longitude,
            currentLocation.latitude,
            currentLocation.longitude
        );
        console.log('distance moved' , distance );
      
      
        
    
        
        // If distance is more than 50 meters, send the update
        if (distance >= 3 ) {
          

            emit_location( currentLocation )

         

            console.log("more than 3 meter  location sent to backend FrontEndSocket")

            
            previousPosition = currentLocation;
        } else {
            // Update previous position without sending to backend
            previousPosition = currentLocation;
        }

    } catch (error) {
        console.error('Error getting location:', error);
    }
}

// Second function - Stop tracking location
function stopLocationTracking() {
    console.log("stopped");
    
    if (trackingInterval) {
        clearInterval(trackingInterval);
        settrackingInterval ( null   ); // 10 seconds

        previousPosition = null;
    }
} 

///////////////////////////////////////////////////////////////////











 useEffect(  ()=>{


  setchatid("")


  getreceiverinfo(receiverid)

   getchatinfo()

  
   stopLocationTracking()

 
  return leave_chat_room()


 } , [ receiverid ])



async function   locateme(){
  const currentPosition = await getCurrentPosition();
  const currentLocation = {
      latitude: currentPosition.coords.latitude,
      longitude: currentPosition.coords.longitude,
      timestamp: new Date().toISOString()
  };


  setUserLocations(prev => ({
    ...prev,
    [myinfo?.username]: {
      position: [currentLocation.latitude, currentLocation.longitude],
      timestamp: currentLocation.timestamp
    },
  }));

}







function leave_chat_room(){
  FrontEndSocket.emit('leave room' , { chat_id , receiverid })
}




function emit_location( content ){
  FrontEndSocket.emit('private message' , {  room : chat_id ,  location  : content , sent_by  : myinfo.username , sent_to :  receiverinfo.username })
  if(chat_id != receiverid) FrontEndSocket.emit('private message' , {  room : receiverid ,  location  : content  , sent_by : myinfo.username , sent_to :  receiverinfo.username })



}





 async function getchatinfo(){

//////////////////  calling api to check whether chat exist or not /////////////////////////
  const {data} = await axiosinstance.post(`${backend_base_url}/accesschat/${receiverid}`)
  

      
/////////////////////////////////    after getting chat_id join the private chat room
  join_chat_room(  data.chat_id )
  setchatid(data.chat_id)

///////////////////////////////////////  if they are already friend , then calling new api to get there old conversation //


  
  
 }




 async function getreceiverinfo(receiverid){

 
  const {data} = await axiosinstance.get(`${backend_base_url}/receiverinfo/${receiverid}`)

  if(data.error==false){  dispatch(  currentreceiver( data.receiverinfo )   )  }
  

 }















function join_chat_room( chat_id){

FrontEndSocket.emit( 'join chat room' , { room : chat_id }     )

 if(chat_id != receiverid) FrontEndSocket.emit( 'join chat room' , { room : receiverid }     )


}







///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const [userLocations, setUserLocations] = useState({});


const mapRef = useRef(null);












useEffect(() => {
  // Listen for private messages with location data
  

  
FrontEndSocket.on('received message', (data) => {
  console.log("location received from bacend ");

  const { location, sent_by, sent_to } = data;

  // Check if the current user is the intended recipient
  if (myinfo.username == sent_to) {
    setUserLocations(prev => ({
      ...prev,
      [sent_by]: {
        position: [location.latitude, location.longitude],
        timestamp: location.timestamp
      },
    }));
  }
});


  // Cleanup FrontEndSocket listener
  return () => {
    FrontEndSocket.off('received message');
  };
}, [FrontEndSocket, myinfo.username]);

// Helper to format timestamp
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString();
};






  return (
    <div className='cp flex-coloumn-center'>

        <div className='cp1 flex-row-center'>
            <div className='cp11 flex-row-center'><div className='flex-row-center'> <img src= { receiverinfo.profile_pic } alt="not found" className='pfpic' /> </div></div>
            <div className='cp12 flex-coloumn-center'>
                <div className='c121'>{   receiverinfo?.username == myinfo?.username ?  "my group" : receiverinfo?.username }</div>
               
            </div>
           
           <div className='cp13  flex-row-center'>
             
           </div>
           

       
        </div>



<div className='cp2 flex-row-center' id='map'>
<MapContainer
    center={ [28.6139, 77.2088] }
    zoom={4}
    style={{ height: "100%", width: "100%" }}
    whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
  

    
{Object.entries(userLocations).map(([username, data]) => {
   
       
        

    return (
        <Marker 
            key={username}
            position={data.position}
        >
            <Popup>
                <div className="p-2">
                    <strong className="block mb-1">{username}</strong>
                    <span className="text-sm text-gray-600">
                      ----  Last updated: {formatTime(data.timestamp)}
                    </span>
                </div>
            </Popup>
        </Marker>
    );
})}
  </MapContainer>
</div>
        

        <div className='cp3 flex-row-center'>
          {chat_id != receiverid ?  <button className="send_location_button"  onClick={sendlocationtobackendsocket}>start sharing location</button> : < div   onClick={locateme} className='locateme'> Locate_Me </div> }
           
        </div>
    </div>
  )
}

export default Chat_profile