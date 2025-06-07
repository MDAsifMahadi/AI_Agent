import {Schema, model} from "mongoose";

const userSchema = Schema({
    userName : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
    },
    password : {
        type: String,
        required: true,
    }
});

const productSchema = Schema({
    title : {
        type : String,
        required : true
    },
    productDetails : {
        type : String,
        required : true,
    },
    imageURL : {
        type : [{
            url : {
                required : true,
                type : String
            },
            public_id : {
                type : String,
                required : true
            }
        }],
        required : true
    },
    additionalInfo : {
        type: [
            {
                type: String
            }
        ]
    }
})

const messagesSchema = Schema({
    userID : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    }
},{
  timestamps: true
});

export const product = model("productInfo", productSchema);
export const user = model("users", userSchema);
export const convercation = model("agentMessages", messagesSchema);

