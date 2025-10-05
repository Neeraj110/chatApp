import { MessageCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";


const ChatSidebarTabs = ({
    activeTab,
    setActiveTab,
}: {
    activeTab: "all" | "groups";
    setActiveTab: (tab: "all" | "groups") => void;
}) => (
    <div className="flex space-x-1 sm:space-x-2 px-3 sm:px-4 sm:py-4 mt-5 md:mt-0">
        <Button
            variant={activeTab === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("all")}
            className="flex-1 text-xs sm:text-sm"
            aria-pressed={activeTab === "all"}
        >
            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            All
        </Button>
        <Button
            variant={activeTab === "groups" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("groups")}
            className="flex-1 text-xs sm:text-sm"
            aria-pressed={activeTab === "groups"}
        >
            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Groups
        </Button>
    </div>
);

export default ChatSidebarTabs;