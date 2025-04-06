const Learn = require("../models/learnModel");
const User = require("../models/signupModels");
const { v4: uuidv4 } = require("uuid");



const addTutorials = async (req, res) => {
  const { userId, title, type, description, link,  blogText, publishedDate } = req.body;
  console.log(req.files);
  
  let { image, images, video } = req.files;



  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      const { name } = user;
      const creator = name;
     
      
      
      
      image = image ? image[0].path : null;
      images = images ? images.map(file => file.path) : []; 
      video = video ? video.map(file => file.path) : []; 
     
      
      
      const response = await Learn.create({
          id: uuidv4(), 
          userId,
          title,
          creator,
          type,
          image,
          description,
          link,
          extraImages:images, 
          videoUrl:video[0],
          blogText,
          publishedDate,
          
      });
      console.log(response);
      
      res.status(201).send(response);

  } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error", error });
  }
};

const getTutorials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const total = await Learn.countDocuments();

    const tutorials = await Learn.find()
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      tutorials,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "There is an error from server side.",
      error: error.message,
    });
  }
};


const getTutorialsById = async (req,res) =>{
  const {id} = req.params;
  console.log({id});
  
  try {
      const response = await Learn.find({_id:id});
         console.log(response);
         
         res.status(201).send(response)
  } catch (error) {
    res.status(500).json({ message: "There is an error from server side.", error: error.message });
  }
};

const getRecommendingLesson = async (req,res) =>{
    const {title} = req.query;
  console.log(title);
  
  try {
    const response = await Learn.find({
      title:{$regex:title,$options:"i"}
    });

    
    
    res.status(201).send(response);

  } catch (error) {
    res.status(500).send({message:"There is an error from server side",error});
  }
}

const likeLesson = async(req,res) =>{

  try {
    const { userId } = req.body;
    const { id } = req.params;

   
    const lesson = await Learn.findById(id);
    if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
    }
    
    if(!userId){
      return res.status(400).json({message:"User Id is required"});
    }
    // Check if user already liked the lesson
    const userIndex = lesson.likedBy.indexOf(userId);
    if (userIndex !== -1) {
        // User already liked, so unlike
        lesson.likedBy.splice(userIndex, 1);
        lesson.likes -= 1;
        await lesson.save();
        return res.status(200).json({ message: "Lesson unliked successfully", lesson });
    }
    
    
    // Add userId to likedBy array and increment likes count
    lesson.likedBy.push(userId);
    lesson.likes += 1;
    await lesson.save();
  
    
    res.status(200).json({ message: "Lesson liked successfully", lesson });
} catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
}
}

module.exports = {getTutorials,addTutorials,getTutorialsById,getRecommendingLesson,likeLesson};