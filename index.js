const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const EngineInput = require("./models/EngineInput");


mongoose.connect("mongodb+srv://anvitasreddy:FsPIjuXvsExySgTc@cluster0.j4et72w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection failed:", err));

app.use(express.urlencoded({ extended: true })); // For form data
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.render("form", { result: null });
});

app.post("/engine-info", (req, res) => {
    const {
        EngineNumber,
        Displacement,
        Power_Output,
        Emmision_Norm,
        FuelType
    } = req.body;

    // ✅ Save to MongoDB
    const newEntry = new EngineInput({
        EngineNumber,
        Displacement,
        Power_Output,
        Emmision_Norm,
        FuelType
    });

    newEntry.save()
        .then(() => console.log("✅ Engine data saved to DB"))
        .catch(err => console.error("❌ Error saving to DB:", err));

    const isPowerInRange = (power, min, max) => {
        const numeric = parseInt(power);
        return numeric >= min && numeric <= max;
    };

    // Matching logic continues below...


    // First block of conditions
    if (
        (
            (EngineNumber === "BharatBenz 4D34i CRDI" && Displacement === "9.3 l" && Power_Output === "170 hp" && Emmision_Norm === "BS-VI" && FuelType === "Diesel") ||
            (EngineNumber === "Weichai WP7NG" && Displacement === "7L" && Power_Output.includes("300") && Emmision_Norm === "BS-VI CNG" && FuelType === "CNG") ||
            (EngineNumber === "Cummins ISB6.7" && Displacement === "6.7L" && isPowerInRange(Power_Output, 200, 300) && Emmision_Norm === "BS-VI" && (FuelType === "Diesel" || FuelType === "CNG")) ||
            (EngineNumber === "Volvo D13K" && Displacement === "13L" && isPowerInRange(Power_Output, 420, 540) && Emmision_Norm === "BS-VI" && FuelType === "Diesel") ||
            (EngineNumber === "Mercedes-Benz OM 457" && Displacement === "12L" && isPowerInRange(Power_Output, 360, 428) && Emmision_Norm === "BS-VI" && FuelType === "Diesel")
        )
    ) {
        return res.render("form", {
            result: [
                {
                    EmissionNorm: "BS-III Diesel",
                    EngineNumber: "Cummins ISB6.7 BS-VI",
                    Power_Output: "200–300 HP",
                    FuelType: "Diesel",
                    ApproximateCost: "₹8–12 Lakhs"
                },
                {
                    EmissionNorm: "BS-IV Diesel",
                    EngineNumber: "Weichai WP7NG BS-VI",
                    Power_Output: "~300 HP",
                    FuelType: "CNG",
                    ApproximateCost: "₹10–14 Lakhs"
                },
                {
                    EmissionNorm: "BS-III/IV Diesel",
                    EngineNumber: "Electric Retrofit Kit",
                    Power_Output: "N/A",
                    FuelType: "Electric",
                    ApproximateCost: "₹15–20 Lakhs"
                }
            ]
        });
    }

    // Second block of conditions
    if (
        (
            (EngineNumber === "Cummins ISX15" && Displacement === "14.9L" && isPowerInRange(Power_Output, 400, 600) && Emmision_Norm === "BS-VI" && FuelType.includes("Diesel")) ||
            (EngineNumber === "Detroit Diesel DD15" && Displacement === "14.8L" && isPowerInRange(Power_Output, 400, 505) && Emmision_Norm === "BS-VI" && FuelType === "Diesel") ||
            (EngineNumber === "Paccar MX-13" && Displacement === "12.9L" && isPowerInRange(Power_Output, 405, 510) && Emmision_Norm === "BS-VI" && FuelType === "Diesel") ||
            (EngineNumber === "Volvo D13K" && Displacement === "13L" && isPowerInRange(Power_Output, 420, 540) && Emmision_Norm === "BS-VI" && FuelType === "Diesel") ||
            (EngineNumber === "Mercedes-Benz OM 473" && Displacement === "15.6L" && Power_Output === "625 HP" && Emmision_Norm === "BS-VI" && FuelType.includes("Diesel"))
        )
    ) {
        return res.render("form", {
            result: [{
                message: "High power heavy-duty diesel engine configuration detected."
            }]
        });
    }

    res.render("form", { result: [{ message: "No matching engine found." }] });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
