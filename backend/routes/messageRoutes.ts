import { Router } from "express";
import {
  sendMessage,
  getMessages,
  createGroup,
  addGroupMembers,
  removeGroupMembers,
  updateGroup,
  startConversation,
  getConversations,
  deleteConversation,
} from "@/controllers/messageController";
import { authenticate } from "@/middlewares/authMiddleware";
import { uploadGroupAvatar, uploadSingleChat } from "@/middlewares/multer";

const router = Router();
router.use(authenticate);

// Single chat routes
router.get("/getConversations", getConversations);
router.post("/send", uploadSingleChat, sendMessage);
router.get("/:conversationId", getMessages);
router.post("/startConversation", startConversation);
router.delete("/:conversationId", deleteConversation);

// Group routes
router.post("/group", uploadGroupAvatar, createGroup);
router.delete("/group/:conversationId", deleteConversation);
router.patch("/group", uploadGroupAvatar, updateGroup);
router.patch("/group/members/remove", removeGroupMembers);
router.patch("/group/members/add", addGroupMembers);

export default router;
