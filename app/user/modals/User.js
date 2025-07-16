import mongoose from "mongoose";
import { ROLE } from "../../enums/role.js";

const UserSchema = new mongoose.Schema(
    {
        firstName:{
            type: String,
            required: true,
            trim: true,
        },
        lastName:{
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
              validator: (v) => /\S+@\S+\.\S+/.test(v),
              message: props => `${props.value} is not a valid email!`
            },
          },
          mobileNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: (v) => /^\d{10}$/.test(v),
                message: (props) => `${props.value} is not a valid mobile number!`
            },
          },
          password: {
            type: String,
            required: true,
            minlength: 8, 
          },
          
          role: {
            type: String,
            enum: Object.values(ROLE), 
            default: ROLE.USER,
          },
          approval: {
            type: Boolean,
            default: true,
          },
          isActive: {
            type: Boolean,
            default: true,
          },
          isDeleted: {
            type: Boolean,
            default: false,
          },
          images: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image',
            default: null,
          },
          updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
          },
          updatedAt: {
            type: Date,
            default: Date.now,
          },
          createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
    },
 {
    timestamps: true,
 }
);

const UserModal = mongoose.model('User', UserSchema);

export default UserModal;