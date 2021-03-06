import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { userRepository } from "../repositores/user.repository";
import { compoarePassword } from "../utils/encript.password";
import { succesfulResponse, unSuccesfulResponse } from "../utils/response";
import { genToken } from "../utils/token";
import {UserDTO} from '../dto/user.dto';
import { IUser } from "../../domain/interfaces/user.interface";

export const auth = {
    vefifyAccountRegistration: async (req: Request, res: Response) => {
        const { hash } = req.params;
        try {
            const userFound = await userRepository.findOneByhash(hash);
            if (!userFound)
                return unSuccesfulResponse(res, { error: 'invalid hash' });

            userFound.isValidated = true;
            await userFound.save()
            succesfulResponse(res, userFound);

        } catch (error) {
            unSuccesfulResponse(res);
        }

 
    },
    signInRegular: async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const userFound = await userRepository.findOneByEmail(email);

        if (!userFound)
            return unSuccesfulResponse(res, { error: 'user or password incorrect' })
        if (!compoarePassword(password, userFound.password))
            return unSuccesfulResponse(res, { error: 'user or password incorrect' })
        const token = genToken({ _id: userFound._id })
        userFound.password = '';
        succesfulResponse(res, { token, user: userFound });
    },
    googleAuth: async (req: Request, res: Response, next: NextFunction) => {
        const client = new OAuth2Client(process.env.CLIENT_ID);
        const token = req.body.xgToken;
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.CLIENT_ID
            });
            const { aud, email, email_verified, picture, family_name, given_name }: any = ticket.getPayload();
            console.log(ticket.getPayload());

            // console.log(payload);
            // If request specified a G Suite domain:
            // const domain = payload['hd'];
            if (process.env.CLIENT_ID !== aud)
                return unSuccesfulResponse(res, { err: 'error on sign in' }, 400);
            req.body.email = email;
            req.body.emailVerified = email_verified;
            req.body.picture = picture;
            req.body.lastname = family_name;
            req.body.name = given_name;
            req.body.password = '12345678Google',
            req.body.isGoogle = true;
            // req.body.picture = picture;
        } catch (error) {
            unSuccesfulResponse(res);
            console.log(error);
        }
        next();

    },
    saveAndAuth : async(req: Request, res: Response)=>{
        const {name, lastname, email, password, isGoogle, picture} = req.body;
        const currentUser:IUser = req.body.currentUser;
        let nUser :UserDTO =  {name, lastname, email, password, isGoogle, picture,state:true,isValidated:true, lastSignIn:undefined, rol:'regular',hash:''} ;
        try {
            if(!currentUser){
                await userRepository.save(nUser);
            }else if(!currentUser.isGoogle){
                return unSuccesfulResponse(res, {error:'Sign in with user and password'})
            }else{
            const token = genToken({_id:currentUser._id});    
            succesfulResponse(res, {user:currentUser, token});
            }
        } catch (error) {
            console.log(error);
            unSuccesfulResponse(res);
        }
        
    }
}