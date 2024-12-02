import mongoose from 'mongoose';
import { ROOM_STATUS } from '#constants/roomStatus'
import BaseModel from './base.model.js'

const roomSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
        },
        images: [
            {
                type: String,
            },
        ],
        bedroom: {
            type: Number,
        },
        bathroom: {
            type: Number,
        },
        size: {
            type: Number,
        },
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
        },
        address: [
            {
                type: String,
            },
        ],
        school: {
            type: String,
        },
        bus: {
            type: String,
        },
        restaurant: {
            type: String,
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            enum: [ROOM_STATUS.AVAILABLE, ROOM_STATUS.RENTED],
            default: ROOM_STATUS.AVAILABLE,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    {
        timestamps: true,
    },
);


const baseModel = new BaseModel(roomSchema)

const Room = baseModel.createModel('Room')

export default Room
