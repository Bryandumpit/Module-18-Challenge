const { Schema, model } = require('mongoose');
//define user schema
const userSchema = new Schema({
        username: {
            type: String,
            unique: true,
            required: "Username is Required",
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: "Username is Required",
            match: [/.+@.+\..+/],
            },
    
        thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Thought",
        },
        ],

        friends: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        ],
    },
    {
        toJSON: {
        virtuals: true,
        },
        id: false,
    }
);
  
  UserSchema.virtual("friendCount").get(function () {
    return this.friends.length;
  });
  
  
//create User model
const User = model('User', userSchema);
//export User
module.exports = User;