import {user} from "../schema/schema.js";

export const chackUserValidity = async (req, res, next) => {
    try {
        const userID = req.headers.userid;
        const chackUser = await user.findById(userID);
        if(chackUser) {
            req.userID = userID;
            next();
            return;
        }
        res.status(404).json({
            message : "User not found!"
        })
    } catch (error) {
        res.status(404).json({
            message : "User not found!"
        })
    }
}