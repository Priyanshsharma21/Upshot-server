import User from '../models/user.js'
import Event from '../models/event.js'
import BigPromise from '../middlewares/bigPromise.js'
import CustomError from '../utils/customError.js'

import * as dotenv from 'dotenv'
import {
    v2 as cloudinary
} from 'cloudinary'
dotenv.config()


export const getAllEvents = BigPromise(async (req, res, next) => {
    const events = await Event.find().sort({ _id: -1 });

    res.status(200).json({
        success: true,
        events
    })
})

export const postEvent = BigPromise(async (req, res, next) => {

    const {
        title,
        description,
        location,
        eventDate,
        duration: {
            from,
            to
        },
        organizer: {
            name,
            contact,
            department
        },
        category,
        cost,
        deadline,
        banner,
        socialMedia
    } = req.body;




    // if (!title || !description || !location || !eventDate || !duration || !organizer || !category || !cost || !deadline || !banner) return next(new CustomError("Please fill up all required fields", 400))


    const photoUrl = await cloudinary.uploader.upload(banner, {
        folder: "events",
    })



    const event = await Event.create({
        title,
        description,
        location,
        eventDate,
        duration: {
            from,
            to
        },
        organizer: {
            name,
            contact,
            department
        },
        category,
        cost,
        deadline,
        banner: {
            id: photoUrl.public_id,
            secure_url: photoUrl.secure_url
        },
        socialMedia,
        user : req.user.id
    })



    res.status(200).json({
        success: true,
        event
    })

})

export const getSingleEvent = BigPromise(async (req, res, next) => {
    const {
        id
    } = req.params;

    const event = await Event.findById(id);

    if (!event) return next(new CustomError("No Event Found", 404))

    res.status(200).json({
        success: true,
        event
    })
})

export const updateEvent = BigPromise(async (req, res, next) => {
    const {
        id
    } = req.params

    const updatedEvent = req.body;


    if (!req.body.banner) return next(new CustomError('Banner Missing', 404))

    if (updatedEvent.banner !== "") {
        const event = await Event.findById(id)

        const imageId = event.banner.id

        await cloudinary.uploader.destroy(imageId)

        const photoUrl = await cloudinary.uploader.upload(req.body.banner, {
            folder: "users",
            width: 150,
            crop: "scale",
        })

        updatedEvent.banner = {
            id: photoUrl.public_id,
            secure_url: photoUrl.secure_url
        }
    }

    const postedEvent = {...updatedEvent, user : req.user.id}

    console.log(postedEvent)

    const event = await Event.findByIdAndUpdate(id, postedEvent, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });


    res.status(200).json({
        success: true,
        event
    })

})

export const deleteEvent = BigPromise(async (req, res, next) => {
    const {
        id
    } = req.params;

    const event = await Event.findById(id);

    if (!event) return next(new CustomError("Event Not Found", 400))

    const deletedEvent = await Event.findByIdAndDelete(id)

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
        deletedEvent
    })
})



export const likeEvent = BigPromise(async (req, res, next) => {
    const eventId = req.params.id;
    const userId = req.user.id;

    console.log({userId,eventId})
  
    try {
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ error: 'Event not found' });
  
      const existingLike = event.likes.find((like) => like.user.toString() === userId);
      if (!existingLike) {
        event.likes.push({ user: userId });
        await event.save();
        return res.json({ message: 'Like added' });
      }
  
      event.likes.pull(existingLike._id);
      await event.save();
  
      res.json({
        message: 'Like removed',
      });
    } catch (error) {
      next(error);
    }
});
  