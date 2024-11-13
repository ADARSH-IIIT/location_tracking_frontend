import {io} from 'socket.io-client'

const endpoint = 'https://location-tracking-backend-tblq.onrender.com'

const FrontEndSocket = io( endpoint , {autoConnect : false} )  



export default FrontEndSocket