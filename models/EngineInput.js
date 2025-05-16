const mongoose = require('mongoose');

const engineInputSchema = new mongoose.Schema({
    EngineNumber: String,
    Displacement: String,
    Power_Output: String,
    Emmision_Norm: String,
    FuelType: String,
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('EngineInput', engineInputSchema);
