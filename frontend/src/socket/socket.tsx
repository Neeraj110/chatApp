/* eslint-disable react-refresh/only-export-components */
import type { RootState } from "@/redux/store";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";


type ConnectionStatus = "connected" | "disconnected" | "connecting" | "reconnecting";

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    onlineUsers: string[];
}

export const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    onlineUsers: [],
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [isConnected, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const { user } = useSelector((state: RootState) => state.user);

    const socket = useMemo(() => {
        if (!user) return null;

        const socketInstance = io(SOCKET_URL, {
            autoConnect: false,
            reconnectionAttempts: 5,
            reconnectionDelay: 3000,
            timeout: 10000,
            withCredentials: true,
        });

        return socketInstance;
    }, [user]);


    useEffect(() => {
        if (!socket || !user) return;

        const handleConnect = () => {
            setConnectionStatus("connected");
            socket.emit("user-join", user._id);
        };

        const handleDisconnect = () => {
            setConnectionStatus("disconnected");
        };

        const handleOnlineUsers = (data: string[]) => {
            setOnlineUsers(data);
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("onlineUsers", handleOnlineUsers);

        socket.connect();

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("onlineUsers", handleOnlineUsers);

            if (socket.connected) {
                socket.disconnect();
            }
        };
    }, [user, socket]);

    const value = useMemo(
        () => ({
            socket,
            isConnected: isConnected === "connected",
            onlineUsers,
        }),
        [socket, isConnected, onlineUsers]
    );


    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}


