"use server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";
import Notification from "@/lib/models/Notification";

export async function createNotification(data) {
  await connectDB();
  
  try {
    const notification = await Notification.create({
      ...data,
      createdAt: new Date(),
    });
    
    return { success: true, notification };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, message: error.message };
  }
}

export async function getNotifications(userId, role, page = 1, limit = 10) {
  await connectDB();
  
  try {
    const skip = (page - 1) * limit;
    
    const notifications = await Notification.find({ 
      recipientId: userId,
      recipientRole: role 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('senderId', 'firstName lastName businessName')
    .lean();
    
    const total = await Notification.countDocuments({ 
      recipientId: userId,
      recipientRole: role 
    });
    
    const unreadCount = await Notification.countDocuments({ 
      recipientId: userId,
      recipientRole: role,
      isRead: false 
    });
    
    return {
      success: true,
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      unreadCount
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { success: false, message: error.message };
  }
}

export async function markNotificationAsRead(notificationId, userId) {
  await connectDB();
  
  try {
    const result = await Notification.updateOne(
      { 
        _id: notificationId,
        recipientId: userId 
      },
      { 
        isRead: true,
        readAt: new Date()
      }
    );
    
    if (result.modifiedCount === 0) {
      return { success: false, message: "Notification not found or access denied" };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, message: error.message };
  }
}

export async function markAllNotificationsAsRead(userId, role) {
  await connectDB();
  
  try {
    const result = await Notification.updateMany(
      { 
        recipientId: userId,
        recipientRole: role,
        isRead: false 
      },
      { 
        isRead: true,
        readAt: new Date()
      }
    );
    
    return { 
      success: true, 
      markedCount: result.modifiedCount 
    };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteNotification(notificationId, userId) {
  await connectDB();
  
  try {
    const result = await Notification.deleteOne({
      _id: notificationId,
      recipientId: userId
    });
    
    if (result.deletedCount === 0) {
      return { success: false, message: "Notification not found or access denied" };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { success: false, message: error.message };
  }
}

// Helper function to create verification request notification
export async function createVerificationRequestNotification(userId, userName) {
  return await createNotification({
    title: "New Verification Request",
    message: `${userName} has submitted their documents for verification.`,
    type: "verification_request",
    recipientId: null, // Will be set to admin users
    recipientRole: "admin",
    senderId: userId,
    relatedId: userId,
    relatedType: "user",
    priority: "high",
    actionUrl: `/admin/dashboard/users`,
    actionText: "Review Application"
  });
}

// Helper function to create verification status notification
export async function createVerificationStatusNotification(userId, status, isApproved = false) {
  const title = isApproved ? "Verification Approved" : "Verification Rejected";
  const message = isApproved 
    ? "Congratulations! Your verification has been approved. You can now start selling."
    : "Your verification has been rejected. Please review the requirements and try again.";
  
  return await createNotification({
    title,
    message,
    type: isApproved ? "verification_approved" : "verification_rejected",
    recipientId: userId,
    recipientRole: "seller",
    relatedId: userId,
    relatedType: "user",
    priority: isApproved ? "high" : "medium",
    actionUrl: "/seller/profile",
    actionText: "View Profile"
  });
}
