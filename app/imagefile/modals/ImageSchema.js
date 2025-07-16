import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    publisherId: {type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true},
    url: {
      type: String
    },
    public_id: {
      type: String
    },
    type: {
      type: String
    },
    size: {
      type:Number
    },
    uploaded_at: { type: Date, default: Date.now },
  });
  
// Create the Image model
export const Image = mongoose.model('Image', imageSchema);  