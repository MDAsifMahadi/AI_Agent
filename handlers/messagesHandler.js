import {user, product, convercation} from "../schema/schema.js";
export const getMessagesHandler = async (req, res) => {
    try {
        const getConvercation = await convercation.find({userID: req.userID}).sort({ createdAt: 1 });
        res.status(200).json({
            messages : getConvercation
        })
    } catch (error) {
        console.log(error)
    }
}

export const postMessagesHandler = async (req, res) => {

}