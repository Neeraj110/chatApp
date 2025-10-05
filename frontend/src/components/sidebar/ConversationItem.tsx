import { memo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useSocket } from "@/socket/useSocket";
import { MoreVertical, Trash2, Users } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConversationItemProps {
    id: string;
    userId?: string;
    name: string;
    avatar?: string;
    lastMessage: string;
    updatedAt: string;
    isActive: boolean;
    isGroup?: boolean;
    participantsCount?: number;
    onClick: () => void;
    onDelete?: (id: string) => void;
    onBack?: () => void;
}

const ConversationItem = memo(
    ({
        id,
        userId,
        name,
        avatar,
        lastMessage,
        updatedAt,
        isActive,
        isGroup = false,
        participantsCount,
        onClick,
        onDelete,

    }: ConversationItemProps) => {
        const { onlineUsers } = useSocket();
        const isOnline = userId ? onlineUsers.includes(userId) : false;
        const [isMenuOpen, setIsMenuOpen] = useState(false);

        const handleDelete = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (onDelete) {
                onDelete(id);
            }
            setIsMenuOpen(false);
        };


        const getInitials = (name: string): string => {
            return name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
        };

        return (
            <div
                onClick={onClick}
                onKeyDown={(e) => e.key === "Enter" && onClick()}
                className={cn(
                    "flex items-center gap-2 sm:gap-3 p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:bg-secondary/50 relative",
                    isActive && "bg-secondary border-r-2 border-primary"
                )}
                role="button"
                tabIndex={0}
                aria-label={`Select conversation with ${name}`}
            >

                <div className="relative">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                        <AvatarImage src={avatar} alt={name} />
                        <AvatarFallback
                            className={cn(
                                "text-primary-foreground text-xs sm:text-sm",
                                isGroup
                                    ? "bg-gradient-to-br from-purple-500 to-pink-500"
                                    : "bg-gradient-primary"
                            )}
                        >
                            {isGroup ? <Users className="h-5 w-5" /> : getInitials(name)}
                        </AvatarFallback>
                    </Avatar>


                    {!isGroup && isOnline && (
                        <span
                            className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                            title="Online"
                        />
                    )}
                </div>


                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <h3 className="font-semibold text-xs sm:text-sm truncate">
                                {name}
                            </h3>


                            {isGroup && participantsCount && (
                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                    ({participantsCount})
                                </span>
                            )}
                        </div>

                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                            {formatDate(updatedAt)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground truncate flex-1 mr-2">
                            {lastMessage || (isGroup ? "No messages in group yet" : "No messages yet")}
                        </p>
                    </div>
                </div>


                {onDelete && (
                    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                            className="opacity-0 group-hover:opacity-100 hover:bg-secondary/80 rounded-full p-1.5 transition-opacity focus:outline-none focus:opacity-100"
                            aria-label="Conversation options"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onClick={handleDelete}
                                className="text-destructive focus:text-destructive cursor-pointer"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete {isGroup ? "Group" : "Conversation"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        );
    }
);

ConversationItem.displayName = "ConversationItem";

export default ConversationItem;

function formatDate(date: string): string {
    const dateObj = new Date(date);
    const today = new Date();
    const isToday = dateObj.toDateString() === today.toDateString();

    return isToday
        ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : dateObj.toLocaleDateString([], { month: "short", day: "numeric" });
}