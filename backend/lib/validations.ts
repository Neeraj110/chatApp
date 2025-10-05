import { z } from "zod";
import mongoose from "mongoose";

const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name cannot exceed 30 characters")
    .trim(),
  email: z.string().email("Please enter a valid email").toLowerCase().trim(),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email").toLowerCase().trim(),
  password: z.string().min(4, "Password is required"),
});

const updateProfileSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(30, "Name cannot exceed 30 characters")
      .trim()
      .optional(),
    email: z
      .string()
      .email("Please enter a valid email")
      .toLowerCase()
      .trim()
      .optional(),
  })
  .refine((data) => data.name || data.email, {
    message: "At least one field (name or email) must be provided",
  });

const sendMessageSchema = z.object({
  conversationId: z.string().refine((val) => mongoose.isValidObjectId(val), {
    message: "Invalid conversation ID",
  }),
  content: z
    .string()
    .max(2000, "Content cannot exceed 2000 characters")
    .optional(),
  fileId: z.string().optional(),
});

const createGroupSchema = z.object({
  groupName: z
    .string()
    .min(3, "Group name must be at least 3 characters")
    .max(50, "Group name cannot exceed 50 characters")
    .trim(),
  participants: z
    .array(
      z.string().refine((val) => mongoose.isValidObjectId(val), {
        message: "Invalid user ID",
      })
    )
    .min(2, "Group must have at least 2 participants"),
});

const addGroupMembersSchema = z.object({
  conversationId: z.string().refine((val) => mongoose.isValidObjectId(val), {
    message: "Invalid conversation ID",
  }),
  participants: z
    .array(
      z.string().refine((val) => mongoose.isValidObjectId(val), {
        message: "Invalid user ID",
      })
    )
    .min(1, "At least one participant must be added"),
});

const removeGroupMembersSchema = z.object({
  conversationId: z.string().refine((val) => mongoose.isValidObjectId(val), {
    message: "Invalid conversation ID",
  }),
  participants: z
    .array(
      z.string().refine((val) => mongoose.isValidObjectId(val), {
        message: "Invalid user ID",
      })
    )
    .min(1, "At least one participant must be removed"),
});

const updateGroupSchema = z.object({
  conversationId: z.string().refine((val) => mongoose.isValidObjectId(val), {
    message: "Invalid conversation ID",
  }),
  groupName: z
    .string()
    .min(3, "Group name must be at least 3 characters")
    .max(50, "Group name cannot exceed 50 characters")
    .trim()
    .optional(),
});

export {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  sendMessageSchema,
  createGroupSchema,
  addGroupMembersSchema,
  removeGroupMembersSchema,
  updateGroupSchema,
};
