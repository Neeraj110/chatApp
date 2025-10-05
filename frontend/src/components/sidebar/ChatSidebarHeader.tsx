import { Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useUser";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/userSlice";

const ChatSidebarHeader = ({
    onCreateChat,

}: {
    onCreateChat: () => void;
    onSettingsClick: () => void;
}) => {
    const logoutMutation = useLogout();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();
            dispatch(logout());
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="p-3 sm:p-4  bg-background sticky top-0 z-10">
            <div className="flex items-center justify-between px-2 md:px-0">
                {/* App Title */}
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    ChatApp
                </h1>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Create Chat */}
                    <Button
                        size="sm"
                        variant="default"
                        onClick={onCreateChat}
                        className="flex items-center gap-1 sm:gap-2"
                        aria-label="Create new chat"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Start</span>
                    </Button>

                    {/* Logout */}
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleLogout}
                        className="flex items-center gap-1 sm:gap-2"
                        aria-label="Logout"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatSidebarHeader;
