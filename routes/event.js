import express from 'express'
import { isLoggedIn,eventCustomRole }  from '../middlewares/user.js'
import { deleteEvent, getAllEvents, getSingleEvent, likeEvent, postEvent, updateEvent } from '../controllers/event.js'

const router = express.Router();

router.get("/event",isLoggedIn, getAllEvents)
router.get("/event/likes/:id",isLoggedIn, likeEvent)

router.post("/event", isLoggedIn, eventCustomRole(["organizer", "admin"]), postEvent);

router.get('/event/:id', getSingleEvent)
router.put("/event/:id",isLoggedIn, eventCustomRole(["organizer", "admin"]), updateEvent);

router.delete("/event/:id",isLoggedIn, eventCustomRole(["organizer", "admin"]), deleteEvent)


export default router




