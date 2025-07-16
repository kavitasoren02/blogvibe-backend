import { getUserByEmail , getUserById} from '../user/Userservice.js';
import * as bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { setCookie, removeCookie } from './cookie.js';

export const loginUser = async(req, res) => {

    const {email, password } = req.body;
    
    try{

        const user = await getUserByEmail(email);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }

        const isPassword = await bcrypt.compare(password, user.password);
        if(!isPassword){
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = JWT.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );
        setCookie(res, 'token',token);
        res.status(200).json({ message: 'Login successful', role: user.role });

    }catch(error){
        console.error('Error during User login:', error);
        res.status(500).json({ message: 'Internal Server error' });
    }
};



export const logoutUser = (req, res) => {
    removeCookie(res, 'token');
    res.status(200).json({ message: 'Logout successfully' });
};


export const getUserInfo = async(req, res) => {
  const id = req.userId;
  const user = await getUserById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json(user);
}