export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isGroup: boolean;
  status: "online" | "away" | "offline";
  members?: number;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  conversationId: string;
}

export const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b8c0?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Hey! How's the project going?",
    lastMessageTime: "2m",
    unreadCount: 2,
    isGroup: false,
    status: "online"
  },
  {
    id: "2",
    name: "Design Team",
    avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Alex: The new mockups are ready!",
    lastMessageTime: "5m",
    unreadCount: 0,
    isGroup: true,
    status: "online",
    members: 8
  },
  {
    id: "3",
    name: "Mike Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Thanks for the code review!",
    lastMessageTime: "1h",
    unreadCount: 0,
    isGroup: false,
    status: "away"
  },
  {
    id: "4",
    name: "Development Squad",
    avatar: "https://images.unsplash.com/photo-1521737604893-c2b6471c9a0a?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Emma: Sprint review at 3 PM",
    lastMessageTime: "2h",
    unreadCount: 1,
    isGroup: true,
    status: "online",
    members: 12
  },
  {
    id: "5",
    name: "Lisa Wang",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Perfect! Let's finalize tomorrow",
    lastMessageTime: "3h",
    unreadCount: 0,
    isGroup: false,
    status: "offline"
  },
  {
    id: "6",
    name: "Marketing Hub",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Campaign metrics look great!",
    lastMessageTime: "1d",
    unreadCount: 0,
    isGroup: true,
    status: "online",
    members: 6
  }
];

export const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      content: "Hi Sarah! The project is coming along great. Just finished the user authentication flow.",
      senderId: "current-user",
      senderName: "You",
      senderAvatar: "",
      timestamp: "10:30 AM",
      conversationId: "1"
    },
    {
      id: "m2",
      content: "That's awesome! I'm excited to see it. Are you still on track for the deadline?",
      senderId: "sarah",
      senderName: "Sarah Johnson",
      senderAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b8c0?w=150&h=150&fit=crop&crop=face",
      timestamp: "10:32 AM",
      conversationId: "1"
    },
    {
      id: "m3",
      content: "Yes, definitely! The real-time features are working smoothly with WebSockets.",
      senderId: "current-user",
      senderName: "You",
      senderAvatar: "",
      timestamp: "10:35 AM",
      conversationId: "1"
    },
    {
      id: "m4",
      content: "Hey! How's the project going?",
      senderId: "sarah",
      senderName: "Sarah Johnson",
      senderAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b8c0?w=150&h=150&fit=crop&crop=face",
      timestamp: "10:45 AM",
      conversationId: "1"
    }
  ],
  "2": [
    {
      id: "m5",
      content: "Good morning team! I've uploaded the latest design files to the shared folder.",
      senderId: "alex",
      senderName: "Alex Rodriguez",
      senderAvatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop&crop=face",
      timestamp: "9:15 AM",
      conversationId: "2"
    },
    {
      id: "m6",  
      content: "Thanks Alex! The new color scheme looks fantastic. Really loving the gradient backgrounds.",
      senderId: "current-user",
      senderName: "You",
      senderAvatar: "",
      timestamp: "9:20 AM",
      conversationId: "2"
    },
    {
      id: "m7",
      content: "Agreed! The user flow is much cleaner now. Should we schedule a review meeting?",
      senderId: "jenny",
      senderName: "Jenny Park",
      senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      timestamp: "9:25 AM",
      conversationId: "2"
    },
    {
      id: "m8",
      content: "The new mockups are ready!",
      senderId: "alex",
      senderName: "Alex Rodriguez", 
      senderAvatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop&crop=face",
      timestamp: "10:40 AM",
      conversationId: "2"
    }
  ],
  "3": [
    {
      id: "m9",
      content: "Hey Mike! I've reviewed your pull request. The code looks solid, just left a few minor suggestions.",
      senderId: "current-user",
      senderName: "You", 
      senderAvatar: "",
      timestamp: "Yesterday 4:30 PM",
      conversationId: "3"
    },
    {
      id: "m10",
      content: "Thanks for the quick turnaround! I'll address those comments and push the updates.",
      senderId: "mike",
      senderName: "Mike Chen",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", 
      timestamp: "Yesterday 4:45 PM",
      conversationId: "3"
    },
    {
      id: "m11",
      content: "Thanks for the code review!",
      senderId: "mike",
      senderName: "Mike Chen",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      timestamp: "9:15 AM", 
      conversationId: "3"
    }
  ]
};