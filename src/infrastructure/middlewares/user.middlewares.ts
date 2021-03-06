import { NextFunction, Request, Response } from "express";
import { IUser } from "../../domain/interfaces/user.interface";
import { userRepository } from "../repositores/user.repository";
import { errorRes } from "../utils/common";
import { unSuccesfulResponse } from "../utils/response";

export const userExistByEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    try {
        let user = await userRepository.findOneByEmail(email);
        if (user && user._id) {
            // console.log(user);
            errorRes(req, `${email} already exist`)
            req.body.currentUser = user;
        }
    } catch (error) {
        unSuccesfulResponse(res);
        console.log(error);
    }
    next();
}

export const userExist = async(req: Request, res: Response, next: NextFunction)=>{
    const {_id} = req.params;
    try{
        const userFound = await userRepository.findOneById(String(_id));
        if(userFound && userFound._id){
            req.body.currrentUser = userFound;
            return next();
        }
        unSuccesfulResponse(res, {msg: 'token contain incorrect data'}) 
    }catch(err){
        return unSuccesfulResponse(res);
    }
}


export const isVerified = async(req: Request, res: Response, next: NextFunction)=>{
    const currrentUser:IUser = req.body.currrentUser;
    try{
        if(currrentUser && currrentUser.isValidated)
            return next();
        errorRes(req, 'user needs to verify account')    
    }catch(err){
        return unSuccesfulResponse(res, {err:'token invalido'}, 403);
    }
}