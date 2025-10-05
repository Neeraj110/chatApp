/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpdateGroup, useAddGroupMembers, useRemoveGroupMembers } from "@/hooks/useChat";
import { useAllUsers } from "@/hooks/useUser";
import { toast } from "sonner";
import { Upload, X, Users, Search } from "lucide-react";
import type { User, ConversationWithPopulatedData } from "@/types/types";
import UserItem from "../modalComponents/UserItem";
import { getConversationAvatar, getConversationName, getGroupAdmin, getGroupParticipantCount } from "@/lib/helper";

interface GroupDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    conversation: ConversationWithPopulatedData;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function GroupDetailsModal({ isOpen, onClose, conversation }: GroupDetailsModalProps) {
    const name = getConversationName(conversation);
    const avatar = getConversationAvatar(conversation);
    const admin = getGroupAdmin(conversation);

    const [groupName, setGroupName] = useState<string>(name || "");
    const [groupAvatar, setGroupAvatar] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(avatar || "");
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isAddingMembers, setIsAddingMembers] = useState<boolean>(false);
    const [isRemovemberLoading, setIsRemoveMemberLoading] = useState<string | null>(null);
    const [isUpdatingGroup, setIsUpdatingGroup] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: users = [], isLoading, error, refetch } = useAllUsers();
    const updateGroupMutation = useUpdateGroup();
    const addGroupMembersMutation = useAddGroupMembers();
    const removeGroupMembersMutation = useRemoveGroupMembers();

    useEffect(() => {
        if (isOpen) {
            setGroupName(name || "");
            setPreviewUrl(avatar || "");
            setSelectedUsers([]);
            setSearchQuery("");
            setGroupAvatar(null);
            refetch();
        }
    }, [isOpen, conversation]);

    const filteredUsers = useMemo(() => {
        return users.filter(
            (u) =>
                Array.isArray(conversation.participants) &&
                !conversation.participants.some((p) => p._id === u._id) &&
                (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [users, searchQuery, conversation.participants]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            toast.error("No file selected");
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        setGroupAvatar(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const removePhoto = () => {
        setGroupAvatar(null);
        setPreviewUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleUpdateGroup = async () => {
        if (!groupName.trim()) {
            toast.error("Group name cannot be empty");
            return;
        }
        if (isUpdatingGroup) return;
        setIsUpdatingGroup(true);
        try {
            await updateGroupMutation.mutateAsync({
                conversationId: conversation._id,
                groupName,
                groupAvatar,
            });
            toast.success("Group updated successfully");
            onClose();
            setIsUpdatingGroup(false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error(`Failed to update group: ${errorMessage}`);
        } finally {
            setIsUpdatingGroup(false);
        }
    };

    const handleAddMembers = async () => {
        if (selectedUsers.length === 0) {
            toast.error("Select at least one user to add");
            return;
        }
        if (isAddingMembers) return;
        setIsAddingMembers(true);

        try {
            await addGroupMembersMutation.mutateAsync({
                conversationId: conversation._id,
                participants: selectedUsers.map((u) => u._id),
            });
            toast.success("Members added successfully");
            setSelectedUsers([]);
            onClose();
            setIsAddingMembers(false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error(`Failed to add members: ${errorMessage}`);

        }
        finally {
            setIsAddingMembers(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (isRemovemberLoading) return;
        setIsRemoveMemberLoading(userId);
        try {
            await removeGroupMembersMutation.mutateAsync({
                conversationId: conversation._id,
                participants: [userId],
            });
            toast.success("Member removed successfully");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error(`Failed to remove member: ${errorMessage}`);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl p-0 max-h-[90vh] flex flex-col overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
                    <DialogTitle className="text-xl">Group Details</DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 overflow-auto px-6 py-4">
                    <div className="space-y-6">
                        {/* Group Avatar */}
                        <div className="flex items-center gap-4 border rounded-lg p-4 bg-secondary/10">
                            <div className="relative">
                                <Avatar className="h-16 w-16">
                                    {previewUrl ? (
                                        <AvatarImage src={previewUrl} alt="Group" />
                                    ) : (
                                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500">
                                            <Users className="h-6 w-6 text-white" />
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                {previewUrl && (
                                    <button
                                        onClick={removePhoto}
                                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                    id="group-photo-input"
                                />
                                <label
                                    htmlFor="group-photo-input"
                                    className="inline-flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-secondary transition"
                                >
                                    <Upload className="h-4 w-4" />
                                    {previewUrl ? "Change Photo" : "Upload Photo"}
                                </label>
                                <p className="text-xs text-muted-foreground mt-1">
                                    JPG, PNG, GIF — Max 5MB
                                </p>
                            </div>
                        </div>

                        {/* Group Name */}
                        <Input
                            placeholder="Enter group name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />

                        {/* Group Admin */}
                        <div>
                            <h3 className="text-sm font-semibold mb-2">Group Admin</h3>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={getConversationAvatar(conversation)} alt={admin?.name} />
                                    <AvatarFallback>{admin?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{admin?.name}</span>
                            </div>
                        </div>

                        {/* Participants */}
                        <div>
                            <h3 className="text-sm font-semibold mb-2">Participants ({getGroupParticipantCount(conversation)})</h3>
                            <ScrollArea className="h-[20vh] border rounded-md bg-secondary/10">
                                <div className="p-2 space-y-2">
                                    {Array.isArray(conversation.participants) && conversation.participants.map((user) => (
                                        <div key={user._id} className="flex items-center justify-between p-2">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.avatar} alt={user.name} />
                                                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">{user.name}</span>
                                            </div>
                                            {admin?._id !== user._id && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleRemoveMember(user._id)}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Add Members */}
                        <div>
                            <h3 className="text-sm font-semibold mb-2">Add Members</h3>
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <ScrollArea className="h-[20vh] border rounded-md bg-secondary/10">
                                <div className="p-2 space-y-2">
                                    {isLoading ? (
                                        <div className="flex justify-center py-12">
                                            <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full"></div>
                                        </div>
                                    ) : error ? (
                                        <div className="text-center py-12">
                                            <p className="text-destructive mb-2">Failed to load users</p>
                                            <Button variant="outline" size="sm" onClick={() => refetch()}>
                                                Try again
                                            </Button>
                                        </div>
                                    ) : filteredUsers.length === 0 ? (
                                        <p className="text-center text-muted-foreground py-6">No users found</p>
                                    ) : (
                                        filteredUsers.map((u) => (
                                            <UserItem
                                                key={u._id}
                                                user={u}
                                                isSelected={selectedUsers.some((s) => s._id === u._id)}
                                                onSelect={() => {
                                                    setSelectedUsers((prev) =>
                                                        prev.some((x) => x._id === u._id)
                                                            ? prev.filter((x) => x._id !== u._id)
                                                            : [...prev, u]
                                                    );
                                                }}
                                            />
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </ScrollArea>

                <div className="flex gap-3 px-6 py-4 border-t bg-background flex-shrink-0">
                    <DialogClose asChild>
                        <Button variant="outline" className="flex-1">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        className="flex-1"
                        onClick={handleUpdateGroup}
                        disabled={isUpdatingGroup || (groupName === name && !groupAvatar)}
                    >
                        {isUpdatingGroup ? "Updating..." : "Update Group"}
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={handleAddMembers}
                        disabled={selectedUsers.length === 0 || isAddingMembers}
                    >
                        {isAddingMembers ? "Adding..." : "Add Members"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}