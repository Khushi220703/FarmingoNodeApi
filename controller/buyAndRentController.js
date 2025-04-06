
const cloudinary = require('cloudinary').v2;
const Product = require("../models/buyAndRentModel");
const User = require("../models/signupModels");

const buyData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const sort = req.query.sort;
    const search = req.query.search;

    // Step 1: Build the filter query
    const query = { isForRent: false };

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.productName = { $regex: `^${search}`, $options: "i" };
    }

    // Step 2: Fetch the full data that matches filters (no pagination yet)
    let allFilteredProducts = await Product.find(query);

    // Step 3: Sort full filtered data if needed
    if (sort === "priceAsc") {
      allFilteredProducts = allFilteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "priceDesc") {
      allFilteredProducts = allFilteredProducts.sort((a, b) => b.price - a.price);
    }

    // Step 4: Calculate pagination from sorted + filtered data
    const total = allFilteredProducts.length;
    const totalPages = Math.ceil(total / limit);

    const paginatedProducts = allFilteredProducts.slice(skip, skip + limit);

    // Step 5: Fetch all unique categories
    const uniqueCategories = await Product.distinct("category", { isForRent: false });

    res.status(200).json({
      products: paginatedProducts,
      total,
      totalPages,
      currentPage: page,
      categories: uniqueCategories
    });
  } catch (error) {
    console.error("Error fetching purchase data:", error);
    res.status(500).json({
      message: "Server error while fetching purchase products",
      error: error.message
    });
  }
};



const rentData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const category = req.query.category;
    const sort = req.query.sort;
    const search = req.query.search;

    const query = { isForRent: true };

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.productName = { $regex: `^${search}`, $options: "i" }; // starts with search term, case-insensitive
    }

    let sortOption = {};
    if (sort === 'priceAsc') sortOption.rentalPrice = 1;
    else if (sort === 'priceDesc') sortOption.rentalPrice = -1;

    // Fetch all matching and sorted products
    const allProducts = await Product.find(query).sort(sortOption);

    const total = allProducts.length;
    const totalPages = Math.ceil(total / limit);

    // Paginate after filtering/sorting
    const paginatedProducts = allProducts.slice(skip, skip + limit);

    const allCategories = await Product.distinct("category", { isForRent: true });

    res.status(200).json({
      products: paginatedProducts,
      total,
      totalPages,
      currentPage: page,
      categories: allCategories
    });
  } catch (error) {
    console.error("Error fetching rental data:", error);
    res.status(500).json({
      message: "Server error while fetching rental products",
      error: error.message
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      productName,
      userId,
      category,
      price,
      description,
      isForRent,
      rentalPrice,
      rentDuration,
      metaData
    } = req.body;

    const imageUrls = [];
    const videoUrls = [];

    const user = await User.findById(userId);  
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {  email } = user;
    const contactDetails = {
     
      email:email
    }
    if (req.file) {  
      const file = req.file; 

      if (file.mimetype.startsWith("image")) {
        imageUrls.push(file.path);  
      } else if (file.mimetype.startsWith("video")) {
        videoUrls.push(file.path);  
      }
    }

    const newProduct = new Product({
      productName,
      category,
      price,
      description,
      isForRent,
      contactDetails,
      rentalPrice: isForRent ? rentalPrice : null,
      rentDuration: isForRent ? rentDuration : null,
      images: imageUrls,  
      postedBy: userId,
      metaData
    });
    
    
    const savedProduct = await newProduct.save();
   

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: savedProduct,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};


const updateProduct = async (req,res) =>{

  try {
    const result = await Product.updateMany(
      {}, 
      { $set: { metaData: { agricultureType: "CropProduction" } } }
    )
    console.log(result);
    
    res.status(200).send({message:"Prdocut updated successfully"});
    
  } catch (error) {
    res.status.send({message:"There is an error from server side."});
  }
}


const recommendedProductsForHome = async (req, res) => {
  try {
    
    
    const { agricultureType } = req.query; // Extract agricultureType from request body
    
    
    if (!agricultureType) {
      return res.status(400).send({ message: "Agriculture type is required." });
    }

    const response = await Product.find({
      isForRent: false, // Ensure it's not for rent
      "metaData.agricultureType": { $regex: agricultureType, $options: "i" }, // Case-insensitive partial match
    });
   
    
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ message: "There is an error from the server side.", error });
  }
};


const likeProduct = async (req,res) =>{

  try {
    const { userId } = req.body;
    const { id } = req.params;

   
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Lesson not found" });
    }
    
    // if(!userId){
    //   return res.status(400).json({message:"User Id is required"});
    // }
    
    const userIndex = product.likedBy.indexOf(userId);
    if (userIndex !== -1) {
       
        product.likedBy.splice(userIndex, 1);
        product.likes -= 1;
        await product.save();
        return res.status(200).json({ message: "Lesson unliked successfully", product });
    }
    
    
    
    product.likedBy.push(userId);
    product.likes += 1;
    await product.save();
  
    
    res.status(200).json({ message: "Lesson liked successfully", product });
} catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
}
}




module.exports = {buyData, rentData,createProduct,updateProduct,recommendedProductsForHome,likeProduct}

