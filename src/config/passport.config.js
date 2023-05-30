import passport from 'passport';
import local from 'passport-local';
import { userModel } from '../Dao/models/users.model.js';
import { createHash, validatePassword } from '../utils.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use('register', new LocalStrategy({passReqToCallback:true, usernameField:'email'}, async (req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body;
            try {
                let user = await userModel.findOne({email:username}); 
                if(user || email === "adminCoder@coder.com"){ //No error occurred but this user already exist and can not continue
                    console.log('User already exist');
                    return done(null,false);
                }else{ //Everything OK
                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                        rol: "user"
                    };
                    let result = await userModel.create(newUser);
                    return done(null, result);
                }
            } catch (error) { //Everything bad, send error
                return done("Error ocurred when try to register: " + error);
            }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        const user = await userService.findById(id);
        done(null, user)
    });
}

export default initializePassport;