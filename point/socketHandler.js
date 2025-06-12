import { callLLM } from "../handlers/callLLM.js";
import { chackSocketUsers } from "../middlewares/chackSicketUser.js";
import {user, convercation} from "../schema/schema.js";

export const socketHandler = async (socket, io) => {
    const {token} = socket.handshake.auth;
    const chackedUser = await chackSocketUsers(token, socket);
    if (chackedUser) {
        const userID = chackedUser.id.toString();
        if (userID) {
            try {
                const chackUser = await user.findById(userID);
                if(chackUser) {
                    const messages = await convercation.find({userID});
                    socket.emit("allMessage", messages);
                    let session = [];
                    socket.on("message", async (message) => {
                        const newMessage= {
                            userID,
                            role : "user",
                            content : message
                        }
                        session.push(newMessage);
                        const newConvercaton = new convercation(newMessage);
                        await newConvercaton.save();
                        const reply = await callLLM(session);
                        
                        socket.emit("reply", reply.content);
                        const llmReply = {...reply, userID}
                        const newReply = new convercation(llmReply);
                        session.push(llmReply);
                        await newReply.save();
                    });
                    return;
                }
            } catch (error) {
                socket.emit("authenticationFailed", {
                    message : "Authentication failed!"
                })
                console.log(error)
            }
        }
    } else {
        socket.emit("authenticationFailed", {
            message : "Authentication failed!"
        })
    }
    
}

            
            