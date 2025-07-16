import { ROLE } from "../enums/role.js";
import UserModal from "../user/modals/User.js";
import * as bcrypt from "bcryptjs";

// const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

//Using-(POST)
export const registerUser = async (data) =>{

const {firstName, lastName, email, mobileNumber, password, role } = data;

const exsistingUser = await UserModal.findOne({ email });

if(exsistingUser){

    throw new Error("Email already exists");
}

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

const newUser = new UserModal({

    firstName,
    lastName,
    email,
    mobileNumber,
    password: hashedPassword,
    role,
    // approval: role === ROLE.USER ? true : false
    // approval: true
    approval: role === ROLE.AUTHOR ? false : true,
    isActive: role === ROLE.AUTHOR ? false : true,
});

try{
    await newUser.save();
    return newUser;
}catch(error){
    throw error;
}
};

//Using-(GET)
export const getAllUsers = async () =>{

    try{
        return await UserModal.find({ isDeleted: false, role: ROLE.USER}, { password: 0});
    }catch(error){
        throw error;
    }
};
//Using-(GET)
export const getAllBloggers = async () =>{

    try{
        return await UserModal.find({ isDeleted: false, role: ROLE.AUTHOR}, { password: 0});
    }catch(error){
        throw error;
    }
};

//Using-(GET)byEmail
export const getUserByEmail = async (email) => {
    try {
      return await UserModal.findOne({email, isDeleted: false, isActive: true})
    } catch (error) {
      throw error; 
    }
  };
  
//Using-(GET)byId
export const getUserById = async (id) =>{

    try{
        return await UserModal.findById(id);
    }catch(error){
        throw error;
    }
};

//Using-(PUT)updatebyid
export const updateUser = async (id, body, updatedBy) => {

    try{
        const updatedUser = await UserModal.findByIdAndUpdate(
         id, {
            ...body,
            updatedAt: Date.now(),
            updatedBy,
    },
    { new: true }
);
return updatedUser;
}catch(error){
    throw error;
 }
};

//Using-(PATCH)softdelete
export const  deleteUser = async (id, deletedBy) =>{

    try{
        const deletedUser = await UserModal.findByIdAndUpdate(
            id,
            {
                isDeleted: true,
                deletedAt: Date.now(),
                deletedBy,
                updatedBy,
                updatedAt: Date.now(),
                isActive: false,
            },
            { new: true}
        );
        return deletedUser;
    }catch(error){
        throw error;
    }
};


