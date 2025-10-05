/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";

const ChatPage = () => {
  const { selectedConversation } = useSelector(
    (state: RootState) => state.conversation
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (selectedConversation && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [selectedConversation]);

  return (
    <div className="h-screen bg-gradient-bg flex overflow-hidden">

      <div className="hidden lg:block">
        <ChatSidebar />
      </div>


      <div className="flex-1 flex flex-col min-w-0">

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-80">
            <ChatSidebar />
          </SheetContent>
        </Sheet>


        {selectedConversation ? (
          <ChatArea onChange={() => setSidebarOpen(true)} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3.75h9M4.5 19.5l2.25-2.25M19.5 19.5l-2.25-2.25m-13.5 0h16.5a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5H4.5A2.25 2.25 0 002.25 6.75v8.25a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <h2 className="text-lg font-semibold">No conversation selected</h2>
            <p className="text-sm mt-2">
              Select a chat from the sidebar to start messaging.
            </p>
            <Button
              variant="outline"
              className="mt-4 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              Open Sidebar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
