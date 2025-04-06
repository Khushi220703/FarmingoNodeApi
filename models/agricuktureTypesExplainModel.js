const mongoose = require('mongoose');

const farmingExplainSchema = new mongoose.Schema({
    ids: { type: String, required: true },
    name: { type: String, required: true },
    introduction: { type: String, required: true },
    explanation: { type: String, required: true },
    types: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true }
    }
  ],
    advantages: { type: [String], required: true },
    disadvantages: { type: [String], required: true },
    futureScope: { type: String, required: true },
    requirements: { 
        type: [
            {
                item: { type: String, required: true },
                description: { type: String, required: true }
            }
        ],
        required: true
    },
    images: { type: [String], required: true },
    sections: {
        type: [
            {
                title: { type: String },
                content: { type: String },
                image: { type: String }
            }
        ],
        required: true
    }
});

const FarmingExplanation = mongoose.model('FarmingExplanation', farmingExplainSchema);
module.exports = FarmingExplanation;
