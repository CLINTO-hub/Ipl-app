import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true
  },
  teamOwner: {
    type: String,
    required: true
  },
  teamCaptain: {
    type: String,
    required: true
  },
  teamCoach: {
    type: String,
    required: true
  },
  teamHomeGround: {
    type: String,
    required: true
  },
  subscriptions: [
    {
      userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    field:{
      type:String,
      enum:['teamName', 'teamOwner', 'teamCaptain', 'teamCoach', 'teamHomeGround']
    }
  }

  ]
});

const Team = mongoose.model('Team', teamSchema);

export default Team;

