import mongoose from 'mongoose'

const { Schema, model } = mongoose

const eventSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    location : {
        type : String,
        required : true,
    },
    eventDate : {
        type : Date,
        required : true,
        default : Date.now
    },

    duration : {
        from : {
            type : Date,
            required : true,
        },
        to : {
            type : Date,
            required : true,
        }
    },

    organizer : {
        name : {
            type : String,
            required : true,
        },
        contact : {
            type : Number,
            required : true,
        },
        department : {
            type : String,
            required : true,
        }
    },

    category : {
        type : String,
        required : true,
    },

    cost : {
        type : Number,
        default : 0,
    },


    deadline : {
        type : Date,
        required : true,
    },

    user : {
        type : Schema.ObjectId,
        ref : 'User',
        required : true,
    },

    banner : {
        id : {
            type : String,
            required : true,
        },
        secure_url : {
            type : String,
            required : true,
        }
    },

    likes : [
        {
            user : {
                type : Schema.ObjectId,
                ref : 'User',
                required : true,
            },
            count : {
                type : Number,
            }
        }
    ],

    socialMedia : {
        type : String,
    },

    postedAt : {
        type : Date,
        default : Date.now
    }
})


const Event = model("Event", eventSchema)


export default Event