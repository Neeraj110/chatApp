/* SingleChatDetailsModal.tsx */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ConversationWithPopulatedData } from "@/types/types";
import { getConversationAvatar, getConversationEmail, getConversationName } from "@/lib/helper";

interface SingleChatDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    conversation: ConversationWithPopulatedData;
}

export function SingleChatDetailsModal({ isOpen, onClose, conversation }: SingleChatDetailsModalProps) {
    const name = getConversationName(conversation);
    const avatar = getConversationAvatar(conversation);
    const email = getConversationEmail(conversation);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md p-0 max-h-[90vh] flex flex-col overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
                    <DialogTitle className="text-xl">User Details</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center gap-4 p-6">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={avatar} alt={name} />
                        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="text-sm text-muted-foreground">{email}</p>
                </div>

                <div className="flex gap-3 px-6 py-4 border-t bg-background flex-shrink-0">
                    <DialogClose asChild>
                        <Button variant="outline" className="flex-1">
                            Close
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}