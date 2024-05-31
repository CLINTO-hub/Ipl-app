import express from 'express'
import { login,logout,signup}  from '../controllers/authController.js'
import { protectRoute } from '../verifyToken/verifyToken.js';
import { getNotifications, getTeams, subscribeTeam } from '../controllers/userController.js';


const router = express.Router();



router.post('/login',login)
router.post('/logout',logout)
router.post('/signup',signup)
router.get('/teams',protectRoute,getTeams)
router.post('/subscribe/:id',protectRoute,subscribeTeam)
router.get('/notifications',protectRoute,getNotifications)



export default router