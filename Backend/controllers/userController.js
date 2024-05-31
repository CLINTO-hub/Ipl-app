import Team from "../models/teamModel.js";
import Notification from "../models/notificationModel.js";


export const subscribeTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const { fields } = req.body; 
    const userId = req.user._id;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ message: "Please provide fields to subscribe to" });
    }

    fields.forEach(field => {
      if (!team.subscriptions.find(subscription => subscription.userId === userId && subscription.field === field)) {
        team.subscriptions.push({ userId, field });
      }
    });

    await team.save();

    res.status(200).json({ success: true, message: "Subscribed to team successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server Error" });
  }
}

  export const getTeams = async (req, res) => {
      try {
          const teams = await Team.find();
  
          if (!teams || teams.length === 0) {
              return res.status(404).json({ message: "Teams not found" });
          } else {
              return res.status(200).json({ success: true, message: "Teams found", teams });
          }
  
      } catch (error) {
          console.log(error.message);
          res.status(500).json({ error: "Internal server Error" });
      }
  }

  export const getNotifications = async (req, res) => {
    try {
      const userId = req.user._id;
      const notifications = await Notification.find({ userId });
  
      res.status(200).json({ success: true, notifications });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
  };