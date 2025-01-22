const mongoose = require("mongoose");

const TypeofRoundsSchema = new mongoose.Schema({
  company: { type: String, required: true },
  aptitude_round: { type: Number, default: 0 },
  technical_round: { type: Number, default: 0 },
  managerial_round: { type: Number, default: 0 },
  technical_hr: { type: Number, default: 0 },
  group_discussion: { type: Number, default: 0 },
  online_coding: { type: Number, default: 0 },
  written_coding_round: { type: Number, default: 0 },
});

module.exports = mongoose.model("TypeofRounds", TypeofRoundsSchema);
