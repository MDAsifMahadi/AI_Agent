import { callLLM } from "../handlers/callLLM.js";
import {user, convercation} from "../schema/schema.js";

export const socketHandler = async (socket, io) => {
    const {userID} = socket.handshake.auth;
    if (userID) {
        try {
            const chackUser = user.findById(userID);
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
            socket.emit("authentication", {
                message : "Authentication failed!"
            })
        }
    }
    
}

            
            