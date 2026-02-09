"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X, Filter, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "@/app/action/NotificationAction";
import { toast } from "sonner";

const NotificationList = ({ userId, role, title = "Notifications", showFilters = false }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const fetchNotifications = async () => {
    setLoading(true);
    const result = await getNotifications(userId, role, page);
    
    if (result.success) {
      setNotifications(result.notifications);
      setPagination(result.pagination);
      setUnreadCount(result.unreadCount);
    } else {
      toast.error("Failed to load notifications");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId, role, page]);

  const handleMarkAsRead = async (notificationId) => {
    const result = await markNotificationAsRead(notificationId, userId);
    if (result.success) {
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true, readAt: new Date() }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllAsRead = async () => {
    const result = await markAllNotificationsAsRead(userId, role);
    if (result.success) {
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true, readAt: new Date() }))
      );
      setUnreadCount(0);
      toast.success(`Marked ${result.markedCount} notifications as read`);
    }
  };

  const handleDelete = async (notificationId) => {
    const result = await deleteNotification(notificationId, userId);
    if (result.success) {
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      toast.success("Notification deleted");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "verification_request":
        return <Bell className="h-4 w-4 text-blue-600" />;
      case "verification_approved":
        return <Check className="h-4 w-4 text-green-600" />;
      case "verification_rejected":
        return <X className="h-4 w-4 text-red-600" />;
      case "product_created":
        return <Bell className="h-4 w-4 text-purple-600" />;
      case "product_updated":
        return <Bell className="h-4 w-4 text-orange-600" />;
      case "product_deleted":
        return <X className="h-4 w-4 text-red-600" />;
      case "transaction_created":
        return <Bell className="h-4 w-4 text-teal-600" />;
      case "escrow_created":
        return <Bell className="h-4 w-4 text-indigo-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.isRead;
    if (filter === "read") return notif.isRead;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{title}</CardTitle>
            <div className="flex items-center gap-4">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="px-3 py-1">
                  {unreadCount} unread
                </Badge>
              )}
              
              {showFilters && (
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border rounded px-3 py-1 text-sm"
                  >
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                </div>
              )}
              
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMarkAllAsRead}
                >
                  Mark All Read
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">
                {filter === "unread" 
                  ? "No unread notifications" 
                  : "No notifications found"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification._id} 
              className={`transition-all hover:shadow-md ${
                !notification.isRead ? "bg-white" : "bg-blue-50 border-blue-200"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        <Badge 
                          variant={notification.isRead ? "secondary" : "default"}
                          className="text-xs"
                        >
                          {notification.isRead ? "Read" : "Unread"}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={`text-xs ${getPriorityColor(notification.priority)}`}
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-700 text-sm">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                        {notification.senderId && (
                          <span className="text-xs text-gray-500">
                            From: {notification.senderId?.firstName} {notification.senderId?.lastName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {!notification.isRead && notification.actionUrl && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="w-full"
                      >
                        Mark as Read
                      </Button>
                    )}
                    
                    {notification.actionUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.location.href = notification.actionUrl}
                        className="w-full"
                      >
                        {notification.actionText || "View"}
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!notification.isRead && (
                          <DropdownMenuItem onClick={() => handleMarkAsRead(notification._id)}>
                            Mark as Read
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDelete(notification._id)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={!pagination.hasPrev}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(prev => Math.min(pagination.pages, prev + 1))}
            disabled={!pagination.hasNext}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
