const Short = require("../models/shortsModel");
const cloudinary = require("../config/cloudinaryConfig")



// add shorts video to the database.

const addShorts = async (req, res) => {
  const data = req.body;

  try {
    const videoFile = req.file;
  
    if (!videoFile) {
      return res.status(400).send({ message: "Please provide a video" });
    }
    console.log(videoFile);
    
    // Upload video to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(videoFile.path, {
      resource_type: "video",
    });

   
   console.log(uploadResponse);
   
    // Save only the secure_url from Cloudinary response
    data.videoURL = uploadResponse.secure_url;

    // Create and save the new Short
    console.log(data);
    
    const short = new Short(data);
    console.log(short);
    
    await short.save();
   
    res.status(201).send("Saved!");
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("There is an error from the server side.");
  }
};




const getShorts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 1; // Fetch only one video at a time
    const skip = (page - 1) * limit;

    const shorts = await Short.find().skip(skip).limit(limit);

   console.log(page,shorts);
   
    res.json(shorts);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).send("Server error");
  }
};




  const liking = async (req, res) => {
    const { shortId, userId, action } = req.body;
    console.log(shortId, userId, action);
   
    
    try {
      
      if (action === "like") {
        // Add userId to likes array and increment likesCount
        const response = await Short.findByIdAndUpdate(
          shortId,
          {
            $push: { likes: userId },    // Add `userId` to `likes` array
            $inc: { likesCount: 1 }      // Increment `likesCount` by 1
          },
          { new: true }  // This will return the updated document
        );
        console.log(response);
        return res.status(200).send(response); 
      } else if (action === "unlike") {
        // Remove userId from likes array and decrement likesCount
        const response = await Short.findByIdAndUpdate(
          shortId,
          {
            $pull: { likes: userId },   
            $inc: { likesCount: -1 }    
          },
          { new: true } 
        );
        console.log(response);
        return res.status(200).send(response);  // Return the updated video data
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "There is an error from the server side." });
    }
  };

  const addCommments =  async (req,res) =>{
    const {userId,videoId,newComment} = req.body;
    const comments = {
      userId: userId,
      text:newComment,
    }
   
   try {
        const response = await Short.findByIdAndUpdate(
          videoId,
          {
            $push: { comments: comments }   
              
          },
          { new: true }  
        )
       
        
      
        
        res.status(201).send(response)
    } catch (error) {
      console.log(error);
      
      res.status(500).send({message:"There is an error from server side."})
    }
  }
  

module.exports = {getShorts,addShorts,liking,addCommments};