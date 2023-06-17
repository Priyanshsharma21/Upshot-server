import express from 'express'
import { isLoggedIn,customRole }  from '../middlewares/user.js'
import { signUp, login, logout, adminDeleteUser, adminUpdateAnyUser,getLoggedInUserDetails,updateUserDetails,getAllUsers,organizerAllUsers,adminGetOneUser } from '../controllers/user.js'


const router = express.Router();

router.post('/signup', signUp)
router.post('/login', login)
router.get('/logout', logout)

router.get('/userdashboard',isLoggedIn, getLoggedInUserDetails)
router.put('/userdashboard/update',isLoggedIn, updateUserDetails)
router.get('/admin/allusers',isLoggedIn,customRole("admin"),getAllUsers)
router.get('/admin/user/:id',isLoggedIn,customRole("admin"),adminGetOneUser)
router.put('/admin/user/:id',isLoggedIn,customRole("admin"),adminUpdateAnyUser)
router.delete('/admin/user/:id',isLoggedIn,customRole("admin"),adminDeleteUser)

router.get('/manager/users',isLoggedIn,customRole("organizer"),organizerAllUsers)



export default router


