import express from 'express'

import { AdminLogin,Adminregister, Adminlogout } from '../controllers/adminController.js'
import { Addteam, updateTeam } from '../controllers/teamController.js'
import { protectRoute } from '../verifyToken/verifyToken.js'

const router = express.Router()

router.post('/login',AdminLogin)
router.post('/register',Adminregister)
router.post('/logout',Adminlogout)
router.post('/addTeam',protectRoute,Addteam)
router.put('/update/:id',protectRoute,updateTeam)

export default router
    