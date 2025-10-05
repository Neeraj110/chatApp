import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";



const ChatSidebarSearch = ({
    searchQuery,
    setSearchQuery,
}: {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}) => (
    <div className="relative mb-3 sm:mb-4 px-3 sm:px-4">
        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50 border-border text-sm"
            aria-label="Search conversations"
        />
    </div>
);

export default ChatSidebarSearch;
