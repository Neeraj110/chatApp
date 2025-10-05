/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo } from "react";
import { CreateChatModal } from "./ChatModal";
import { useConversations, useStartConversation, useCreateGroup, useDeleteConversation } from "@/hooks/useChat";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { setSelectedConversation } from "@/redux/slices/conversationSlice";
import type { Conversation, ConversationWithPopulatedData } from "@/types/types";
import ChatSidebarHeader from "../sidebar/ChatSidebarHeader";
import ChatSidebarTabs from "../sidebar/ChatSidebarTabs";
import ChatSidebarSearch from "../sidebar/ChatSidebarSearch";
import ConversationItem from "../sidebar/ConversationItem";
import { getConversationName, getConversationAvatar, getConversationUserId } from "@/lib/helper";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConversationsResponse {
    success: boolean;
    conversations: ConversationWithPopulatedData[];
}

type TabType = "all" | "groups";



export function ChatSidebar() {
    const dispatch = useDispatch();
    const { selectedConversation } = useSelector((state: RootState) => state.conversation);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [activeTab, setActiveTab] = useState<TabType>("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

    const {
        data,
        isLoading: conversationsLoading,
        error: conversationsError
    } = useConversations();
    const startConversationMutation = useStartConversation();
    const createGroupMutation = useCreateGroup();
    const deleteConversationMutation = useDeleteConversation();

    const conversationsData = data as ConversationsResponse | undefined;
    const conversations: ConversationWithPopulatedData[] = conversationsData?.conversations || [];

    const filteredConversations = useMemo(() => {
        return conversations.filter((conv: ConversationWithPopulatedData) => {
            if (activeTab === "groups" && !conv.isGroup) {
                return false;
            }
            const name = getConversationName(conv);
            return name.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [conversations, activeTab, searchQuery]);

    const handleSelectConversation = (conversation: ConversationWithPopulatedData): void => {
        dispatch(setSelectedConversation(conversation as Conversation));
    };

    const handleCreateSingleChat = async (recipientId: string): Promise<void> => {
        try {
            console.log("Creating single chat with recipientId:", recipientId);


            const existingConversation = conversations.find(
                (conv) => !conv.isGroup && getConversationUserId(conv) === recipientId
            );

            if (existingConversation) {
                toast.info("Conversation already exists");
                dispatch(setSelectedConversation(existingConversation as Conversation));
                setIsCreateModalOpen(false);
                return;
            }

            await startConversationMutation.mutateAsync(recipientId);
            toast.success("Conversation started");
            setIsCreateModalOpen(false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error(`Failed to start conversation: ${errorMessage}`);
        }
    };

    const handleCreateGroupChat = async (
        groupName: string,
        participants: string[],
        groupAvatar?: File | null
    ): Promise<void> => {
        try {
            await createGroupMutation.mutateAsync({ groupName, participants, groupAvatar });
            toast.success("Group created");
            setIsCreateModalOpen(false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error(`Failed to create group: ${errorMessage}`);
        }
    };

    const handleDeleteClick = (conversationId: string): void => {
        setConversationToDelete(conversationId);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async (): Promise<void> => {
        if (!conversationToDelete) return;

        try {
            await deleteConversationMutation.mutateAsync(conversationToDelete);
            // Clear selected conversation if it's the one being deleted
            if (selectedConversation?._id === conversationToDelete) {
                dispatch(setSelectedConversation(null));
            }
            toast.success("Conversation deleted");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error(`Failed to delete conversation: ${errorMessage}`);
        } finally {
            setDeleteDialogOpen(false);
            setConversationToDelete(null);
        }
    };

    const handleTabChange = (tab: TabType): void => {
        setActiveTab(tab);
    };

    const handleSearchChange = (query: string): void => {
        setSearchQuery(query);
    };

    const handleOpenCreateModal = (): void => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = (): void => {
        setIsCreateModalOpen(false);
    };

    if (conversationsLoading) {
        return (
            <div className="w-full lg:w-80 bg-chat-sidebar border-r border-border flex flex-col h-full">
                <div className="p-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (conversationsError) {
        return (
            <div className="w-full lg:w-80 bg-chat-sidebar border-r border-border flex flex-col h-full">
                <div className="p-4 text-center text-destructive">
                    Failed to load conversations
                </div>
            </div>
        );
    }

    return (
        <div className="w-full lg:w-80 bg-chat-sidebar border-r border-border flex flex-col h-full">
            <ChatSidebarHeader
                onCreateChat={handleOpenCreateModal}
                onSettingsClick={() => console.log("Settings clicked")}
            />

            <ChatSidebarSearch
                searchQuery={searchQuery}
                setSearchQuery={handleSearchChange}
            />

            <ChatSidebarTabs
                activeTab={activeTab}
                setActiveTab={handleTabChange}
            />

            <CreateChatModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onCreateSingleChat={handleCreateSingleChat}
                onCreateGroupChat={handleCreateGroupChat}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this conversation? This action cannot be undone and all messages will be permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setConversationToDelete(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex-1 overflow-y-auto mt-5 md:mt-0">
                {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                        No conversations found.{" "}
                        <button
                            onClick={handleOpenCreateModal}
                            className="text-primary hover:underline"
                            type="button"
                        >
                            Start a new chat
                        </button>
                    </div>
                ) : (
                    filteredConversations.map((conv: ConversationWithPopulatedData) => (
                        <div key={conv._id} className="group">
                            <ConversationItem
                                id={conv._id}
                                userId={conv.isGroup ? undefined : getConversationUserId(conv)}
                                name={getConversationName(conv)}
                                avatar={getConversationAvatar(conv)}
                                lastMessage={conv.lastMessage?.content || ""}
                                updatedAt={conv.updatedAt}
                                isActive={selectedConversation?._id === conv._id}
                                isGroup={conv.isGroup}
                                participantsCount={conv.isGroup ? conv.participantsCount : undefined}
                                onClick={() => handleSelectConversation(conv)}
                                onDelete={handleDeleteClick}

                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}