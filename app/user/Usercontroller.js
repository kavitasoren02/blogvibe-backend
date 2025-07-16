import express from 'express';
import { registerUser, getAllUsers, getUserById, updateUser, deleteUser, getAllBloggers} from './Userservice.js';
import { validateUser } from './validation/validateUser.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', validateUser, async (req, res) => {

    try {

        const newUser = await registerUser(req.body);
        res.status(201).json({ message: 'User registered successfully' , user: newUser });

    } catch (error) {

        console.error('Error creating user.', error); 
        res.status(500).json({ message: 'Failed to register user', error: error.message }); 

    }
});

router.get( '/', async (req, res) => {

    try{

        const users = await getAllUsers();
        res.status(200).json({ users});

    }catch(error){

        console.error('Error fetching users.', error);
        res.status(500).json({ message: 'Internal server Error'}); 
        
    }
});

router.get( '/bloggers', async (req, res) => {

    try{

        const users = await getAllBloggers();
        res.status(200).json({ users});

    }catch(error){

        console.error('Error fetching users.', error);
        res.status(500).json({ message: 'Internal server Error'}); 
        
    }
});


router.get('/:id' , async(req, res) =>{

    const { id } = req.params;
    try{
        const user = await getUserById(id);
        if(!user){

            return res.status(404).json({ message: 'User not found'});

        }
        res.status(200).json({ user });
    }catch(error){

        console.error('Error fetching user by ID.',error);
        res.status(500).json({message: 'Internal Server Error'})
        
    }
});

router.put('/:id', authenticate, async(req, res) => {

    const { id } = req.params;
    try{
        const updatedUser = await updateUser(id, req.body, req.userId);
        if(!updatedUser){

            return res.status(404).json({ message: 'User not found'});

        }
        res.status(200).json({ message: 'Updated successfully', user: updatedUser });
    }catch( error ){

        console.error('Error updating user');
        res.status(500).json({message: 'Internal Server Error'})

    }
});

router.delete('/:id', authenticate, async(req, res) => {

    const { id } = req.params;
    try{

        const deletedUser  =  await deleteUser(id, req.userId);
        if(!deletedUser){
            
            return res.status(404).json({message: 'User not found'});

        }
        res.status(200).json({ message: 'User deleted successfully'});
    }catch(error){

        console.error('Error deleting user');
        res.status(500).json({ message: 'Internal Server error'})
    }
})



export default router;
