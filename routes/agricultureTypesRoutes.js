const {getAgricultureData,addAgricultureTypeData,addAgricultureTypeExplanationData,getAgricultureTypeExplanationData} = require("../controller/agricultureTypesController");
const express = require("express");
const router = express.Router();

router.post("/addAgricultureTypeData", addAgricultureTypeData);
router.get("/getAgricultureData", getAgricultureData);
router.post("/addAgricultureTypeExplanationData", addAgricultureTypeExplanationData);
router.get("/getAgricultureTypeExplanationData/:ids", getAgricultureTypeExplanationData);

module.exports = router;