import { Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/types/types";
import { cn } from "@/lib/utils";



const UserItem = ({
    user,
    isSelected,
    onSelect,
    disabled,
}: {
    user: User;
    isSelected: boolean;
    onSelect: () => void;
    disabled?: boolean;
}) => (
    <div
        className={cn(
            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
            "hover:bg-secondary/80 border border-transparent",
            isSelected && "bg-primary/10 border-primary/50",
            disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
        )}
        onClick={disabled ? undefined : onSelect}
    >
        <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        {isSelected && (
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-primary-foreground" />
            </div>
        )}
    </div>
);

export default UserItem;