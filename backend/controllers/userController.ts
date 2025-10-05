import User, { IUser } from "../models/User";
import { Request, Response } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { z } from "zod";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from "../lib/validations";
import { uploadOnCloudinary, deleteOnCloudinary } from "../lib/uploadMedia";
import axios from "axios";
import { oauth2Client } from "../lib/googleClient";

interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateToken = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return user.generateAccessToken();
};

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { name, email, password } = validatedData;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and password are required",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      const user = await User.create({
        name,
        email,
        password,
        authType: "local",
      });

      if (!user) {
        return res.status(500).json({
          success: false,
          message: "Failed to create user",
        });
      }

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error,
        });
      }
      throw error;
    }
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = await generateToken(user._id as string);

    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate access token",
      });
    }

    return res
      .status(200)
      .cookie("token", token, options)
      .json({
        success: true,
        message: "Login successful",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          authType: user.authType,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error,
      });
    }

    throw error;
  }
});

export const googleLogin = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { code } = req.body;

      if (!code) {
        return res
          .status(400)
          .json({ message: "Authorization code is required" });
      }
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const userInfoResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        }
      );

      const { email, name, picture } = userInfoResponse.data;

      let user: IUser | null = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name,
          email,
          avatar: picture,
          authType: "google",
        });
      }

      const safeUser = await User.findById(user._id).select("-password -__v ");

      const token = await generateToken(user?._id as string);

      return res
        .status(200)
        .cookie("token", token, options)
        .json({ message: "User logged in successfully", data: safeUser });
    } catch (error: any) {
      console.error("Google login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export const getUserProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      throw error;
    }
  }
);

export const updateUserProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const validatedData = updateProfileSchema.parse(req.body);

      if (validatedData.email) {
        const existingUser = await User.findOne({
          email: validatedData.email,
          _id: { $ne: userId },
        });

        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Email is already in use by another user",
          });
        }
      }

      const updatedUser = await User.findByIdAndUpdate(userId, validatedData, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error,
        });
      }

      throw error;
    }
  }
);

export const updateAvatar = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No avatar file provided",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // delete old avatar if exists
      if (user.avatar) {
        try {
          await deleteOnCloudinary(user.avatar);
        } catch (error) {
          console.warn("⚠️ Failed to delete old avatar:", error);
        }
      }

      // ✅ Upload new avatar
      const uploadResult = await uploadOnCloudinary(req.file.path, {
        folder: "avatars",
      });

      if (!uploadResult) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload avatar",
        });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { avatar: uploadResult.secure_url },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Avatar updated successfully",
        data: {
          _id: updatedUser!._id,
          name: updatedUser!.name,
          email: updatedUser!.email,
          avatar: updatedUser!.avatar,
          createdAt: updatedUser!.createdAt,
          updatedAt: updatedUser!.updatedAt,
        },
      });
    } catch (error) {
      throw error;
    }
  }
);

export const deleteUserAccount = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.avatar) {
        try {
          await deleteOnCloudinary(user.avatar);
        } catch (error) {
          console.warn("Failed to delete avatar:", error);
        }
      }

      await User.findByIdAndDelete(userId);

      return res.status(200).json({
        success: true,
        message: "Account deleted successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

export const logoutUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }
      return res
        .status(200)
        .cookie("token", "", options)
        .json({ message: "User logged out successfully" });
    } catch (error) {
      throw error;
    }
  }
);

export const fetchAllUsers = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }
      const users = await User.find({ _id: { $ne: userId } }).select(
        "-password -__v -authType"
      );

      return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users,
      });
    } catch (error) {
      throw error;
    }
  }
);
