import {io} from 'socket.io-client'

const endpoint = 'http://localhost:3000'

const FrontEndSocket = io( endpoint , {autoConnect : false} )  



export default FrontEndSocket