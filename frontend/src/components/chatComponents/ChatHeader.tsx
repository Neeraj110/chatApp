import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Info, Phone, Video, ArrowLeft, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConversationWithPopulatedData } from "@/types/types";
import { getConversationAvatar, getConversationName } from "@/lib/helper";
import { isGroupChat, isSingleChat } from "@/types/types";
import { GroupDetailsModal } from "../modalComponents/GroupDetailsModal";
import { SingleChatDetailsModal } from "../modalComponents/SingleChatDetailsModal";

interface ChatHeaderProps {
    conversation: ConversationWithPopulatedData;
    isOnline?: boolean;
    onBack?: () => void;
}

const ChatHeader = ({ conversation, isOnline, onBack }: ChatHeaderProps) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const name = getConversationName(conversation);
    const avatar = getConversationAvatar(conversation);

    const getInitials = (name: string): string => {
        return name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    const getStatusText = (): string => {
        if (isSingleChat(conversation)) {
            return isOnline ? "Online" : "Offline";
        }
        if (isGroupChat(conversation)) {
            return `${conversation.participantsCount} members`;
        }
        return "";
    };

    const showOnlineIndicator = isSingleChat(conversation) && isOnline;

    return (
        <>
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border bg-card">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Button
                        onClick={onBack}
                        variant="ghost"
                        size="icon"
                        className="lg:hidden h-9 w-9 flex-shrink-0"
                        aria-label="Back to conversations"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div className="relative flex-shrink-0">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                            <AvatarImage src={avatar} alt={name} />
                            <AvatarFallback
                                className={cn(
                                    "text-primary-foreground text-sm",
                                    isGroupChat(conversation)
                                        ? "bg-gradient-to-br from-purple-500 to-pink-500"
                                        : "bg-gradient-primary"
                                )}
                            >
                                {isGroupChat(conversation) ? (
                                    <Users className="h-5 w-5" />
                                ) : (
                                    getInitials(name)
                                )}
                            </AvatarFallback>
                        </Avatar>

                        {showOnlineIndicator && (
                            <div className="absolute -bottom-0.5 -right-0.5">
                                <div className="h-3 w-3 rounded-full border-2 border-background bg-green-500 relative">
                                    <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-sm sm:text-base truncate">
                            {name}
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {getStatusText()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    {isSingleChat(conversation) && (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-9 w-9 p-0"
                            aria-label="Start voice call"
                        >
                            <Phone className="h-4 w-4" />
                        </Button>
                    )}

                    {isSingleChat(conversation) && (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-9 w-9 p-0"
                            aria-label="Start video call"
                        >
                            <Video className="h-4 w-4" />
                        </Button>
                    )}

                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-9 w-9 p-0"
                        onClick={() => setIsDetailsOpen(true)}
                        aria-label={
                            isGroupChat(conversation)
                                ? "View group details"
                                : "View conversation details"
                        }
                    >
                        <Info className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {isGroupChat(conversation) ? (
                <GroupDetailsModal
                    isOpen={isDetailsOpen}
                    onClose={() => setIsDetailsOpen(false)}
                    conversation={conversation as ConversationWithPopulatedData}
                />
            ) : (
                <SingleChatDetailsModal
                    isOpen={isDetailsOpen}
                    onClose={() => setIsDetailsOpen(false)}
                    conversation={conversation}
                />
            )}
        </>
    );
};

export default ChatHeader;