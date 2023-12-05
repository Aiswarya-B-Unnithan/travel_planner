import mongoose from "mongoose";
import Travelers from "../models/travelerModel.js";
import Posts from "../models/postModel.js"
export const createPost = async (req, res, next) => {
  try {
    console.log("body",req.body)
    const userId=req.body.userId
    const  description = req.body.description;
    const image=req.body.image
    if (!description) {
      next("You Must Provide A Description");
      return;
    } else {
      const post = await Posts.create({
        userId: userId,
        description: description,
        image: image,
      });

      res.status(200).json({
        success: true,
        message: "post created successfully",
        data: post,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { search } = req.body;

    const user = await Travelers.findById({ userId });
    const friends = user?.friends?.toString().split(",") ?? [];
    console.log(friends);
    //fetching users friends post as well as their own post
    friends.push(userId);

    const searchPostQuery = {
      $or: [
        {
          description: { $regx: search, $options: "i" },
        },
      ],
    };

    const posts = await Posts.find(search ? searchPostQuery : {})
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 });

    const friendsPosts = posts?.filter((post) => {
      return friends.includes(post?.userId?._id.toString());
    });

    const otherPosts = posts?.filter((post) => {
      !friends.includes(post?.userId?._id.toString());
    });

    let postResult = null;
    if (friendsPosts.length > 0) {
      postResult = search ? friendsPosts : [...friendsPosts, ...otherPosts];
    } else {
      postResult = posts;
    }

    res.status(200).json({
      success: true,
      message: "Sucessfull",
      data: postResult,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};
