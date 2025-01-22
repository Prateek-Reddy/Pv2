const mongoose = require("mongoose");

const RoundsandGenderWiseSchema = new mongoose.Schema({
  company: { type: String, required: true },
  no_of_rounds: { type: Number, default: 0 },
  no_of_online_rounds: { type: Number, default: 0 },
  no_of_offline_rounds: { type: Number, default: 0 },
  no_of_students_hired: { type: Number, default: null },
  no_of_male_students: { type: Number, default: null },
  no_of_female_students: { type: Number, default: null },
});

module.exports = mongoose.model("RoundsandGenderWise", RoundsandGenderWiseSchema);
