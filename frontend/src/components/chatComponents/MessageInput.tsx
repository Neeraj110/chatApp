import React, { useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Paperclip, Smile, Send, Mic, X } from "lucide-react";

const MessageInput = ({
    messageText,
    selectedFile,
    setSelectedFile,
    setMessageText,
    handleSendMessage,
    isSending,
}: {
    messageText: string;
    setMessageText: (value: string) => void;
    handleSendMessage: () => Promise<void>;
    selectedFile: File | null;
    setSelectedFile: (file: File | null) => void;
    isSending: boolean;
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey && !isSending) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <div className="p-3 sm:p-4 border-t border-border bg-card">
            {/* ✅ File Preview */}
            {selectedFile && (
                <div className="mb-2 flex items-center gap-2 bg-muted p-2 rounded-lg">
                    {selectedFile.type.startsWith("image/") ? (
                        <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="preview"
                            className="h-12 w-12 object-cover rounded-md"
                        />
                    ) : (
                        <div className="px-3 py-2 text-sm bg-background rounded-md">
                            {selectedFile.name}
                        </div>
                    )}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => setSelectedFile(null)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <div className="flex items-center gap-2 sm:gap-3">
                {/* ✅ Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isSending}
                />

                <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 sm:h-9 sm:w-9 p-0 flex-shrink-0"
                    aria-label="Attach file"
                    disabled={isSending}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Paperclip className="h-4 w-4" />
                </Button>

                {/* ✅ Message Input */}
                <div className="flex-1 relative">
                    <Input
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="pr-10 sm:pr-12 bg-background text-sm sm:text-base"
                        aria-label="Message input"
                        disabled={isSending}
                    />
                    <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-7 sm:w-7 p-0"
                        aria-label="Add emoji"
                        disabled={isSending}
                    >
                        <Smile className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                </div>

                {/* ✅ Send or Mic */}
                {(messageText.trim() || selectedFile) ? (
                    <Button
                        onClick={handleSendMessage}
                        size="sm"
                        className="bg-gradient-primary hover:shadow-glow transition-all duration-300 h-8 sm:h-9 px-3 sm:px-4"
                        aria-label="Send message"
                        disabled={isSending}
                    >
                        {isSending ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                    </Button>
                ) : (
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0 flex-shrink-0"
                        aria-label="Record voice message"
                        disabled={isSending}
                    >
                        <Mic className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default MessageInput;
