import Team from "../models/teamModel.js";
import Notification from "../models/notificationModel.js";
import { Server } from "socket.io";


const io = new Server();

export const socketMiddleware = (req, res, next) => {
    req.io = io;
    next();
  };

export const Addteam =  async(req,res)=>{
    try {
        const {teamName,teamOwner,teamCaptain,teamCoach,teamHomeGround} = req.body

        console.log(req.body);

        if(!teamName || !teamOwner || !teamCaptain || !teamCoach || !teamHomeGround){
            return res.status(400).json({message:"Please enter valid details"})
        }
       

        

        const user = await Team.findOne({teamName:teamName})
        if(user){
            return res.status(400).json({message:'Team already exist'})
        }

        const newTeam = new Team({
            teamName,
            teamOwner,
            teamCaptain,
            teamCoach, 
            teamHomeGround,
            subscriptions: []
        })

      await newTeam.save()
      res.status(200).json({success:true,message:" sucessfully created"})

    }

 catch (error) {

        console.log(error.message);
        res.status(500).json({error:"Internal server Error"})


        
    }
}

export const updateTeam = async (req, res) => {
    const id = req.params.id;
    const updatedFields = req.body;

    try {
        const team = await Team.findById(id);
        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }

        const updatedTeam = await Team.findByIdAndUpdate(id, { $set: updatedFields }, { new: true });

       
        const userIds = team.subscriptions.map(subscription => subscription.userId);
        

        
        const subscriptions = team.subscriptions.filter(subscription => updatedFields.hasOwnProperty(subscription.field));
        const notifications = subscriptions.map(subscription => ({
            userId: subscription.userId,
            teamId: updatedTeam._id,
            message: `The ${subscription.field} has been updated`
        }));

        await Notification.insertMany(notifications);

        req.io.emit("teamUpdated", { teamId: updatedTeam._id, userIds }); 

        res.status(200).json({ success: true, message: 'Successfully updated', data: updatedTeam });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Failed to update' });
    }
};

  

