import User, { IUser } from "@/models/User";
import Conversation, { IConversation } from "@/models/Conversation";
import Message, { IMessage } from "@/models/Message";
import { Request, Response } from "express";
import { asyncHandler } from "@/lib/asyncHandler";
import { z } from "zod";
import { uploadOnCloudinary, deleteOnCloudinary } from "@/lib/uploadMedia";
import {
  sendMessageSchema,
  createGroupSchema,
  addGroupMembersSchema,
  removeGroupMembersSchema,
  updateGroupSchema,
} from "@/lib/validations";
import mongoose, { isValidObjectId } from "mongoose";
import { io } from "@/index";

interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const sendMessage = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validatedData = sendMessageSchema.parse(req.body);
      const { conversationId, content } = validatedData;
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const conversation = await Conversation.findById(conversationId).lean();
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      if (
        !conversation.participants.some((p: mongoose.Types.ObjectId) =>
          p.equals(userId as mongoose.Types.ObjectId)
        )
      ) {
        return res.status(403).json({
          success: false,
          message: "User not part of this conversation",
        });
      }

      let finalContent = content?.trim() || "";
      let fileId: string | null = null;

      if (req.file) {
        const allowedMimeTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "video/mp4",
          "video/webm",
        ];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
          return res.status(400).json({
            success: false,
            message:
              "Unsupported file type. Only JPEG, PNG, GIF, MP4, and WebM are allowed.",
          });
        }

        const uploadResult = await uploadOnCloudinary(req.file.path, {
          folder: "chat-media",
          resource_type: req.file.mimetype.startsWith("video")
            ? "video"
            : "image",
        });

        if (!uploadResult) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload media",
          });
        }
        fileId = uploadResult.secure_url;
      }

      if (!finalContent && !fileId) {
        return res.status(400).json({
          success: false,
          message: "Message must contain text or media",
        });
      }

      const message = new Message({
        conversationId,
        sender: userId,
        content: finalContent,
        fileId,
      });

      await message.save();

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
      });

      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "name email avatar")
        .lean();

      const messageToSend = {
        ...populatedMessage,
        conversationId: conversationId.toString(),
      };

      io.to(conversationId.toString()).emit("newMessage", messageToSend);

      return res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: messageToSend,
      });
    } catch (error) {
      console.error("SendMessage Error:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
);

export const getMessages = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const conversationId = req.params.conversationId;
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid conversation ID",
        });
      }

      const conversation = await Conversation.findById(conversationId).lean();
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      if (
        !conversation.participants.some((p: mongoose.Types.ObjectId) =>
          p.equals(userId as mongoose.Types.ObjectId)
        )
      ) {
        return res.status(403).json({
          success: false,
          message: "User not part of this conversation",
        });
      }

      const messages = await Message.find({ conversationId })
        .populate("sender", "name email avatar")
        .sort({ createdAt: 1 })
        .lean();

      const transformedMessages = messages.map((msg) => ({
        ...msg,
        conversationId: msg.conversationId.toString(),
      }));

      return res.status(200).json({
        success: true,
        messages: transformedMessages,
      });
    } catch (error) {
      console.error("GetMessages Error:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
);

export const startConversation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { recipientId } = req.body;
      const userId = req.user?._id;

      console.log(
        "StartConversation: recipientId =",
        recipientId,
        "userId =",
        userId
      );

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }

      if (recipientId === userId.toString()) {
        return res.status(400).json({
          success: false,
          message: "Cannot start conversation with yourself",
        });
      }

      const recipient = await User.findById(recipientId);
      if (!recipient) {
        return res
          .status(404)
          .json({ success: false, message: "Recipient not found" });
      }
      let conversation = await Conversation.findOne({
        isGroup: false,
        participants: { $all: [userId, recipientId], $size: 2 },
      });
      if (conversation) {
        return res.status(200).json({
          success: true,
          message: "Conversation already exists",
          conversation,
        });
      }
      conversation = new Conversation({
        participants: [userId, recipientId],
        isGroup: false,
      });
      await conversation.save();
      io.to(userId.toString()).emit("newConversation", conversation);
      io.to(recipientId.toString()).emit("newConversation", conversation);
      return res.status(201).json({
        success: true,
        message: "Conversation started successfully",
        conversation,
      });
    } catch (error) {
      throw error;
    }
  }
);

export const deleteConversation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const conversationId = req.params.conversationId;
      const userId = req.user?._id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res
          .status(404)
          .json({ success: false, message: "Conversation not found" });
      }
      if (
        !conversation.participants.includes(userId as mongoose.Types.ObjectId)
      ) {
        return res.status(403).json({
          success: false,
          message: "User not part of this conversation",
        });
      }
      await Conversation.findByIdAndDelete(conversationId);
      await Message.deleteMany({ conversationId });
      io.to(userId.toString()).emit("conversationDeleted", conversationId);
      return res
        .status(200)
        .json({ success: true, message: "Conversation deleted successfully" });
    } catch (error) {
      throw error;
    }
  }
);

export const getConversations = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "Valid user ID required" });
      }

      const conversations = await Conversation.find({
        participants: userId,
      })
        .select(
          "participants lastMessage updatedAt isGroup groupName groupAvatar groupAdmin"
        )
        .populate({
          path: "participants",
          select: "name email avatar",
        })
        .populate({
          path: "lastMessage",
          select: "content createdAt sender",
        })
        .populate({
          path: "groupAdmin",
          select: "name email avatar",
        })
        .sort({ updatedAt: -1 })
        .lean();

      const formattedConversations = conversations.map(
        (conversation: IConversation) => {
          // Group Chat
          if (conversation.isGroup) {
            return {
              _id: conversation._id,
              isGroup: true,
              groupName: conversation.groupName,
              groupAvatar: conversation.groupAvatar,
              groupAdmin: conversation.groupAdmin,
              participants: conversation.participants,
              participantsCount: conversation.participants.length,
              lastMessage: conversation.lastMessage || null,
              updatedAt: conversation.updatedAt,
            };
          }

          const otherParticipants = conversation.participants.filter(
            (participant) => participant._id.toString() !== userId.toString()
          );

          return {
            _id: conversation._id,
            isGroup: false,
            participants: otherParticipants[0] || null,
            lastMessage: conversation.lastMessage || null,
            updatedAt: conversation.updatedAt,
          };
        }
      );

      return res.status(200).json({
        success: true,
        conversations: formattedConversations,
        message: "Conversations fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching conversations",
        error: error instanceof Error ? error.message : error,
      });
    }
  }
);

export const createGroup = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validatedData = createGroupSchema.parse(req.body);
      const { groupName, participants } = validatedData;
      const userId = req.user?._id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }

      if (!participants.includes(userId.toString())) {
        participants.push(userId.toString());
      }

      const users = await User.find({ _id: { $in: participants } });
      if (users.length !== participants.length) {
        return res
          .status(400)
          .json({ success: false, message: "One or more users not found" });
      }

      let groupAvatar = "";
      if (req.file) {
        try {
          const uploadResult = await uploadOnCloudinary(req.file.path, {
            folder: "group-avatars",
            resource_type: "image",
          });
          if (!uploadResult) {
            return res.status(500).json({
              success: false,
              message: "Failed to upload group avatar",
            });
          }
          groupAvatar = uploadResult.secure_url;
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: `Group avatar upload failed: ${(error as Error).message}`,
          });
        }
      }

      const conversation = new Conversation({
        participants,
        isGroup: true,
        groupAdmin: userId,
        groupName,
        groupAvatar,
      });
      await conversation.save();

      participants.forEach((participantId) => {
        io.to(participantId.toString()).emit("newGroup", conversation);
      });

      return res.status(201).json({
        success: true,
        message: "Group created successfully",
        conversation,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.format(),
        });
      }
      throw error;
    }
  }
);

export const deleteGroup = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const conversationId = req.params.conversationId;
      const userId = req.user?._id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res
          .status(404)
          .json({ success: false, message: "Conversation not found" });
      }

      if (!conversation.isGroup) {
        return res
          .status(400)
          .json({ success: false, message: "Conversation is not a group" });
      }

      if (conversation.groupAdmin?.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Only group admin can delete the group",
        });
      }

      if (conversation.groupAvatar) {
        await deleteOnCloudinary(conversation.groupAvatar);
      }

      await Conversation.findByIdAndDelete(conversationId);
      await Message.deleteMany({ conversationId });
      io.to(conversationId.toString()).emit("groupDeleted", conversationId);
      return res
        .status(200)
        .json({ success: true, message: "Group deleted successfully" });
    } catch (error) {
      throw error;
    }
  }
);

export const addGroupMembers = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validatedData = addGroupMembersSchema.parse(req.body);
      const { conversationId, participants } = validatedData;
      const userId = req.user?._id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res
          .status(404)
          .json({ success: false, message: "Conversation not found" });
      }

      if (!conversation.isGroup) {
        return res
          .status(400)
          .json({ success: false, message: "Conversation is not a group" });
      }

      if (
        !conversation.participants.includes(userId as mongoose.Types.ObjectId)
      ) {
        return res
          .status(403)
          .json({ success: false, message: "User not part of this group" });
      }

      const users = await User.find({ _id: { $in: participants } });
      if (users.length !== participants.length) {
        return res
          .status(400)
          .json({ success: false, message: "One or more users not found" });
      }

      const newParticipants = participants.filter(
        (p) =>
          !conversation.participants.includes(new mongoose.Types.ObjectId(p))
      );
      if (newParticipants.length === 0) {
        return res.status(400).json({
          success: false,
          message: "All users are already in the group",
        });
      }

      conversation.participants.push(
        ...newParticipants.map((p) => new mongoose.Types.ObjectId(p))
      );
      await conversation.save();

      newParticipants.forEach((participantId) => {
        io.to(participantId.toString()).emit("addedToGroup", conversation);
      });
      io.to(conversationId.toString()).emit("groupUpdated", conversation);

      return res.status(200).json({
        success: true,
        message: "Members added successfully",
        conversation,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.format(),
        });
      }
      throw error;
    }
  }
);

export const removeGroupMembers = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validatedData = removeGroupMembersSchema.parse(req.body);
      const { conversationId, participants } = validatedData;
      const userId = req.user?._id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res
          .status(404)
          .json({ success: false, message: "Conversation not found" });
      }

      if (!conversation.isGroup) {
        return res
          .status(400)
          .json({ success: false, message: "Conversation is not a group" });
      }

      if (
        !conversation.participants.includes(userId as mongoose.Types.ObjectId)
      ) {
        return res
          .status(403)
          .json({ success: false, message: "User not part of this group" });
      }

      const users = await User.find({ _id: { $in: participants } });
      if (users.length !== participants.length) {
        return res
          .status(400)
          .json({ success: false, message: "One or more users not found" });
      }

      if (participants.includes(userId.toString())) {
        return res.status(400).json({
          success: false,
          message: "Cannot remove yourself from the group",
        });
      }

      conversation.participants = conversation.participants.filter(
        (p: { toString: () => string }) => !participants.includes(p.toString())
      );

      if (conversation.participants.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Group must have at least 2 members",
        });
      }

      await conversation.save();

      participants.forEach((participantId) => {
        io.to(participantId.toString()).emit(
          "removedFromGroup",
          conversationId
        );
      });
      io.to(conversationId.toString()).emit("groupUpdated", conversation);

      return res.status(200).json({
        success: true,
        message: "Members removed successfully",
        conversation,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.format(),
        });
      }
      throw error;
    }
  }
);

export const updateGroup = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validatedData = updateGroupSchema.parse(req.body);
      const { conversationId, groupName } = validatedData;
      const uplaodAvatar = req.file?.path;

      const userId = req.user?._id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }

      if (!uplaodAvatar && !groupName) {
        return res.status(400).json({
          success: false,
          message: "At least one of groupName or groupAvatar is required",
        });
      }

      if (!conversationId) {
        return res
          .status(400)
          .json({ success: false, message: "Conversation ID is required" });
      }

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res
          .status(404)
          .json({ success: false, message: "Conversation not found" });
      }

      if (!conversation.isGroup) {
        return res
          .status(400)
          .json({ success: false, message: "Conversation is not a group" });
      }

      if (
        !conversation.participants.includes(userId as mongoose.Types.ObjectId)
      ) {
        return res
          .status(403)
          .json({ success: false, message: "User not part of this group" });
      }

      let groupAvatar = conversation.groupAvatar;
      if (req.file) {
        try {
          if (conversation.groupAvatar) {
            await deleteOnCloudinary(conversation.groupAvatar);
          }
          const uploadResult = await uploadOnCloudinary(uplaodAvatar!, {
            folder: "group-avatars",
            resource_type: "image",
          });
          if (!uploadResult) {
            return res.status(500).json({
              success: false,
              message: "Failed to upload group avatar",
            });
          }
          groupAvatar = uploadResult.secure_url;
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: `Group avatar upload failed: ${(error as Error).message}`,
          });
        }
      }

      conversation.groupName = groupName || conversation.groupName;
      conversation.groupAvatar = groupAvatar;
      await conversation.save();

      io.to(conversationId.toString()).emit("groupUpdated", conversation);

      return res.status(200).json({
        success: true,
        message: "Group updated successfully",
        conversation,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.format(),
        });
      }
      throw error;
    }
  }
);

export const leaveGroup = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const conversationId = req.params.conversationId;
      const userId = req.user?._id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res
          .status(404)
          .json({ success: false, message: "Conversation not found" });
      }
      if (!conversation.isGroup) {
        return res
          .status(400)
          .json({ success: false, message: "Conversation is not a group" });
      }

      if (
        !conversation.participants.includes(userId as mongoose.Types.ObjectId)
      ) {
        return res
          .status(403)
          .json({ success: false, message: "User not part of this group" });
      }
      conversation.participants = conversation.participants.filter(
        (p: { toString: () => string }) => p.toString() !== userId.toString()
      );
      if (conversation.participants.length < 2) {
        await Conversation.findByIdAndDelete(conversationId);
        await Message.deleteMany({ conversationId });
        io.to(conversationId.toString()).emit("groupDeleted", conversationId);
        return res.status(200).json({
          success: true,
          message:
            "You left the group. Group deleted as it had less than 2 members.",
        });
      }
      await conversation.save();
      io.to(conversationId.toString()).emit("groupUpdated", conversation);
      return res.status(200).json({
        success: true,
        message: "Left group successfully",
        conversation,
      });
    } catch (error) {
      throw error;
    }
  }
);
