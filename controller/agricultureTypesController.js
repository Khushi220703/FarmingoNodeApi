//data for testing.
const CropProduction = require("../models/agricultureTypesModel");
const FarmingExplaination = require("../models/agricuktureTypesExplainModel");

const addAgricultureTypeData = async (req,res) =>{
  try {

    const response = await CropProduction.insertMany();
    res.status(201).send(response);

  } catch (error) {
    console.log("Error at agricultureTypes ",error);
        
    res.status(500).send("There is an error from server side.")
  }
}

const getAgricultureData = async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1; // Default to page 1
      const limit = parseInt(req.query.limit) || 3; // Default items per page
      const skip = (page - 1) * limit;

      // Fetch total count for pagination
      const totalItems = await CropProduction.countDocuments();
      const totalPages = Math.ceil(totalItems / limit);

      // Fetch paginated data
      const response = await CropProduction.find().skip(skip).limit(limit);

      res.status(200).json({ 
          items: response, 
          totalPages, 
          currentPage: page, 
          totalItems 
      });

  } catch (error) {
      console.log("Error at agricultureTypes ", error);
      res.status(500).json({ message: "There is an error from server side.", error });
  }
};

const addAgricultureTypeExplanationData = async (req, res) => {

  console.log("---------------------------");
  
  try {
    const {
      ids,
      name,
      introduction,
      explanation,
      types,
      advantages,
      disadvantages,
      futureScope,
      requirements,
      images,
      sections
    } = req.body;

    
    
    // Validate required fields before saving
    if (!ids || !name || !introduction || !explanation || !types.length || 
        !advantages.length || !disadvantages.length || !futureScope || 
        !requirements.length || !images.length || !sections.length) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newEntry = new FarmingExplaination({
      ids,
      name,
      introduction,
      explanation,
      types,
      advantages,
      disadvantages,
      futureScope,
      requirements,
      images,
      sections
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    console.log("Error at agricultureTypes", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getAgricultureTypeExplanationData = async (req, res) => {
  try {
   
  
    
    let { ids } = req.params; 
    ids = ids.replace(":","");
    
     
    if (!ids) {
      return res.status(400).json({ message: "ID is required." });
    }

    const data = await FarmingExplaination.find({ids}); 
   
    
    if (!data) {
      return res.status(404).json({ message: "No agriculture data found for this ID." });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching agriculture data by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = {getAgricultureData,addAgricultureTypeData,addAgricultureTypeExplanationData,getAgricultureTypeExplanationData};