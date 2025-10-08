import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useMessages, useSendMessage } from "@/hooks/useChat";
import { isSingleChat, type ConversationWithPopulatedData, type Message } from "@/types/types";
import { useSocket } from "@/socket/useSocket";
import ChatHeader from "../chatComponents/ChatHeader";
import MessageInput from "../chatComponents/MessageInput";
import MessageBubble from "../chatComponents/MessageBubble";

interface ChatAreaProps {
    onChange?: () => void;
}

export function ChatArea({ onChange }: ChatAreaProps) {
    const { selectedConversation: conversation } = useSelector(
        (state: RootState) => state.conversation
    ) as { selectedConversation: ConversationWithPopulatedData | null };
    const { user } = useSelector((state: RootState) => state.user);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [messageText, setMessageText] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const { socket, onlineUsers } = useSocket();
    const { data: messagesData, isLoading, isError, refetch } = useMessages(
        conversation?._id as string
    );
    const sendMessageMutation = useSendMessage();

    const conversationUserId = conversation && isSingleChat(conversation)
        ? conversation.participants._id
        : undefined;

    const isUserOnline = conversationUserId
        ? onlineUsers.includes(conversationUserId)
        : false;

    useEffect(() => {
        if (messagesData?.messages) {
            setMessages(messagesData.messages);
        }
        return () => setMessages([]);
    }, [messagesData]);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, isLoading]);

    useEffect(() => {
        if (!socket || !conversation?._id) {
            console.log("Socket or conversation ID missing:", { socket, conversationId: conversation?._id });
            return;
        }

        socket.emit("joinConversation", conversation._id);

        const handleNewMessage = (newMessage: Message) => {
            if (newMessage.conversationId === conversation._id) {
                setMessages((prev) => {
                    if (prev.some((msg) => msg._id === newMessage._id)) {
                        return prev;
                    }
                    return [...prev, newMessage];
                });
            }
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("connect", () => console.log("Socket connected:", socket.id));
        socket.on("connect_error", (error) => console.error("Socket connection error:", error));
        socket.on("disconnect", (reason) => console.log("Socket disconnected:", reason));

        return () => {
            console.log("Leaving conversation:", conversation._id);
            socket.emit("leaveConversation", conversation._id);
            socket.off("newMessage", handleNewMessage);
            socket.off("connect");
            socket.off("connect_error");
            socket.off("disconnect");
        };
    }, [conversation?._id, socket]);

    const handleSendMessage = useCallback(async () => {
        if ((!messageText.trim() && !selectedFile) || !conversation?._id || !user) return;

        try {
            const formData = new FormData();
            formData.append("conversationId", conversation._id);
            if (messageText.trim()) formData.append("content", messageText.trim());
            if (selectedFile) formData.append("media", selectedFile);

            setMessageText("");
            setSelectedFile(null);

            await sendMessageMutation.mutateAsync(formData);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }, [messageText, selectedFile, conversation?._id, user, sendMessageMutation]);

    if (!conversation) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <h2 className="text-2xl font-bold mb-2">Welcome to ChatApp</h2>
                    <p className="text-muted-foreground">Select a conversation to start chatting</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background">
            <ChatHeader
                conversation={conversation}
                isOnline={isUserOnline}
                onBack={onChange}
            />
            <div
                className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1.5 sm:space-y-2.5 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
                ref={messagesContainerRef}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                ) : isError ? (
                    <div className="text-center text-sm text-destructive">
                        Failed to load messages.{" "}
                        <button className="text-primary hover:underline" onClick={() => refetch()}>
                            Try again
                        </button>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((message: Message) => (
                        <MessageBubble
                            key={message._id}
                            message={message}
                            currentUserId={user?._id || ""}
                        />
                    ))
                )}
                <div ref={messagesEndRef} className="mb-5" />
            </div>
            <MessageInput
                messageText={messageText}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                setMessageText={setMessageText}
                handleSendMessage={handleSendMessage}
                isSending={sendMessageMutation.isPending}
            />
        </div>
    );
}