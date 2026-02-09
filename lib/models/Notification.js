import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['verification_request', 'verification_approved', 'verification_rejected', 'product_created', 'product_updated', 'product_deleted', 'transaction_created', 'escrow_created'],
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipientRole: {
    type: String,
    enum: ['admin', 'seller', 'buyer'],
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    // Reference to related document (product, transaction, etc.)
  },
  relatedType: {
    type: String,
    enum: ['user', 'product', 'transaction', 'escrow'],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  actionUrl: {
    type: String,
    // URL to navigate to when clicking notification
  },
  actionText: {
    type: String,
    // Text for action button
  },
}, {
  timestamps: true,
});

// Index for better query performance
notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ recipientRole: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;
