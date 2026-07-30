import mongoose from "mongoose";

const sesstionSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    }
},{timeseries:true})

export const Session = mongoose.model('Sesstion', sesstionSchema)