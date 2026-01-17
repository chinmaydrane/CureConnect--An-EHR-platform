import Notification from "../models/Notification.js";
import AccessRequest from "../models/AccessRequest.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;          // 👈 use logged-in user

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { read: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update notification" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find the notification and ensure it's owned by this user
    const notif = await Notification.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!notif) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const relatedRequestId = notif.relatedRequestId;

    // 2️⃣ Delete the notification itself
    await Notification.deleteOne({ _id: id });

    // 3️⃣ If linked to an access request, delete that too
    if (relatedRequestId) {
      await AccessRequest.deleteOne({ _id: relatedRequestId });
    }

    res.json({ message: "Notification and related access request deleted (if any)" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};
