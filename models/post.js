const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "貼文姓名未填寫"],
        },
        image: {
            type: String,
            default: "",
        },
        content: {
            type: String,
            required: [true, "Content 未填寫"],
        },
        likes: {
            type: Number,
            default: 0,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = mongoose.model("Post", postSchema);
