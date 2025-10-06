import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/types";



interface MessageBubbleProps {
    message: Message;
    currentUserId: string;
    isOnline?: boolean;
}

const formatDate = (date: string): string => {
    const dateObj = new Date(date);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - dateObj.getTime()) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (dateObj.toDateString() === now.toDateString()) {
        return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return dateObj.toLocaleDateString([], { month: "short", day: "numeric" });
};

const MessageBubble = memo(({ message, currentUserId }: MessageBubbleProps) => {
    const isOwn = message.sender._id === currentUserId;





    const renderMessageContent = () => {
        if (message.content) {
            return <p className="text-sm leading-relaxed break-words">{message.content}</p>;
        }
        else if (message.fileId) {
            const isVideo = message.fileId.endsWith(".mp4") || message.fileId.endsWith(".webm");
            if (isVideo) {
                return (
                    <video
                        src={message.fileId}
                        controls
                        className="max-w-full h-auto rounded-lg"
                        style={{ maxHeight: "200px" }}
                    >
                        Your browser does not support the video tag.
                    </video>
                );
            } else {
                return (
                    <img
                        src={message.fileId}
                        alt="Shared media"
                        className="max-w-full h-auto rounded-lg"
                        style={{ maxHeight: "200px" }}
                    />
                );
            }
        }
        else {
            return <p className="text-sm text-muted-foreground">Unsupported message type</p>;
        }
    };


    return (
        <div
            className={cn(
                "flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%] lg:max-w-[70%]",
                isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
            aria-live="polite"
        >
            {!isOwn && (
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                    <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                        {message.sender.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                    </AvatarFallback>
                </Avatar>
            )}
            <div
                className={cn(
                    "rounded-lg px-3 py-2 sm:px-4 sm:py-2 shadow-message transition-all duration-200 hover:shadow-lg",
                    isOwn
                        ? "bg-gradient-message text-white ml-1 sm:ml-2"
                        : "bg-chat-message-bg text-foreground mr-1 sm:mr-2"
                )}
            >
                {!isOwn && (
                    <p className="text-xs font-medium text-primary mb-1">{message.sender.name}</p>
                )}
                {renderMessageContent()}
                <div className="flex items-center gap-2 mt-1">
                    <p
                        className={cn(
                            "text-xs opacity-70",
                            isOwn ? "text-white/70" : "text-muted-foreground"
                        )}
                    >
                        {formatDate(message.createdAt)}
                    </p>
                </div>
            </div>
        </div>
    );
});

MessageBubble.displayName = "MessageBubble";
export default MessageBubble;
