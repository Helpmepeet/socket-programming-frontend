import io from "socket.io-client";
import { createContext } from "react";

const socker_url = process.env.NEXT_PUBLIC_SOCKER_SERVER_URL

export const socket = io(socker_url ? socker_url : "http://localhost:9000", { transports: ["websocket"] });
export const SocketContext = createContext(socket);
