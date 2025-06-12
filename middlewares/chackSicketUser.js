import jwt from "jsonwebtoken";
import { user } from "../schema/schema.js";
export const chackSocketUsers = async (token, socket) => {
    try {
        if (token) {
            const verifyedUser = await jwt.verify(token, process.env.JWT);
            if (verifyedUser) {
                const chackedUser = await user.findById(verifyedUser.id);
                return {
                    id : chackedUser._id
                }
            } else {
                socket.emit("authenticationFailed", {
                    message : "Authentication failed!"
                })
            }
        } else {
            socket.emit("authenticationFailed", {
                message : "Authentication failed!"
            })
        }
    } catch (error) {
        socket.emit("authenticationFailed", {
            message : "Authentication failed!"
        })
    }
}