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
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAllUsers } from "@/hooks/useUser";
import { toast } from "sonner";
import { Upload, X, Users, Search } from "lucide-react";
import type { User } from "@/types/types";
import UserItem from "../modalComponents/UserItem";

interface CreateChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateSingleChat: (userId: string) => Promise<void>;
    onCreateGroupChat: (
        groupName: string,
        participants: string[],
        groupAvatar?: File
    ) => Promise<void>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;



export function CreateChatModal({
    isOpen,
    onClose,
    onCreateSingleChat,
    onCreateGroupChat,
}: CreateChatModalProps) {
    const [activeTab, setActiveTab] = useState<"single" | "group">("single");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [groupName, setGroupName] = useState<string>("");
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [groupAvatar, setGroupAvatar] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: users = [], isLoading, error, refetch } = useAllUsers();

    useEffect(() => {
        if (!isOpen) {
            setActiveTab("single");
            setSelectedUser(null);
            setSelectedUsers([]);
            setGroupName("");
            setSearchQuery("");
            setGroupAvatar(null);
            setPreviewUrl("");
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) refetch();
    }, [isOpen]);

    const filteredUsers = useMemo(() => {
        return users.filter(
            (u: User) =>
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

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

    const handleCreate = async () => {
        if (activeTab === "single") {
            if (!selectedUser) return toast.error("Please select a user");
            await onCreateSingleChat(selectedUser._id);
            onClose();
        } else {
            if (!groupName.trim()) return toast.error("Enter a group name");
            if (selectedUsers.length === 0) return toast.error("Select at least one user");
            if (selectedUsers.length > 9) return toast.error("You can select up to 9 users");
            await onCreateGroupChat(
                groupName,
                selectedUsers.map((u) => u._id),
                groupAvatar || undefined
            );
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl p-0 max-h-[90vh] flex flex-col overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
                    <DialogTitle className="text-xl">
                        {activeTab === "single"
                            ? "Start New Conversation"
                            : "Create Group Chat"}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 overflow-auto px-6 py-4">
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
                    ) : (
                        <Tabs
                            value={activeTab}
                            onValueChange={(v) => setActiveTab(v as "single" | "group")}
                            className="flex flex-col h-full"
                        >
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="single">Single Chat</TabsTrigger>
                                <TabsTrigger value="group">Group Chat</TabsTrigger>
                            </TabsList>

                            {/* SINGLE CHAT */}
                            <TabsContent value="single">
                                <div className="relative mb-3">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>

                                <ScrollArea className="h-[55vh] border rounded-md bg-secondary/10">
                                    <div className="p-2 space-y-2">
                                        {filteredUsers.length === 0 ? (
                                            <p className="text-center text-muted-foreground py-6">
                                                No users found
                                            </p>
                                        ) : (
                                            filteredUsers.map((u) => (
                                                <UserItem
                                                    key={u._id}
                                                    user={u}
                                                    isSelected={selectedUser?._id === u._id}
                                                    onSelect={() => setSelectedUser(u)}
                                                />
                                            ))
                                        )}
                                    </div>
                                </ScrollArea>
                            </TabsContent>

                            {/* GROUP CHAT */}
                            <TabsContent value="group">
                                <div className="space-y-4">
                                    {/* Group Avatar Upload */}
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

                                    <Input
                                        placeholder="Enter group name"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                    />

                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search users..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>

                                    <ScrollArea className="h-[45vh] border rounded-md bg-secondary/10">
                                        <div className="p-2 space-y-2">
                                            {filteredUsers.length === 0 ? (
                                                <p className="text-center text-muted-foreground py-6">
                                                    No users found
                                                </p>
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
                            </TabsContent>
                        </Tabs>
                    )}
                </ScrollArea>


                <div className="flex gap-3 px-6 py-4 border-t bg-background flex-shrink-0">
                    <DialogClose asChild>
                        <Button variant="outline" className="flex-1">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button className="flex-1" onClick={handleCreate} disabled={isLoading}>
                        {activeTab === "single" ? "Start Chat" : "Create Group"}
                        {isLoading && (
                            <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full ml-2"></div>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
