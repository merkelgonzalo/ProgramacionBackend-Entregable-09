import { Router } from 'express';
import {userModel} from '../Dao/models/users.model.js';
import { createHash, validatePassword } from '../utils.js';
import passport from 'passport';

const router = Router();

router.post('/register', passport.authenticate('register', {failureREdirect:'/failregister'}), async (req, res) =>{
    res.send({status:"success", message:"User registered"});
});

router.get('/failregister', async (req, res) => {
    console.log("Failed strategy");
    res.send({error:"Error ocurred when try to register"});
})

router.post('/login', async (req,res)=>{
    const { email, password } = req.body;
    let user;

    try{
        
        if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
            user = {
                first_name: 'Administrador',
                last_name: 'Del Sistema',
                email: email,
                age: 99,
                rol: 'admin'
            };
        }else{
            user = await userModel.findOne({email});
            const isValidPassword = validatePassword(password,user);
            if(!isValidPassword) return res.status(400).send({status:"error", error:"Invalid data"})
        }

        if(!user){
            return res.status(400).send({status:"error", error:"Invalid data"})
        }
      
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            rol: user.rol
        }
        res.send({status:"success", payload:req.session.user, message:"Welcome!"})
    }catch(error) {
        console.log('Cannot login with mongoose: '+error)
        res.status(500).send('Internal server error');
    }
});

router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"Couldn't close session"});
        res.redirect('/login');
    })
})

export default router;