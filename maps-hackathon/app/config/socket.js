import socketIOClient from "socket.io-client";
import environment from "../config/environment/environment";


const socket = socketIOClient(environment.baseUrl);
export default socket;