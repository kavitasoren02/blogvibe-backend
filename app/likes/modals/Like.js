import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema(
    {
                blog: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Blog',
                    required: true,
                },
        
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
    },{
        timestamps: true,
    }
)
const LikeModal = mongoose.model("Like", LikeSchema);

export default LikeModal;