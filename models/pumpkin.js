
const mongoose = require('mongoose');

const pumpkinSchema = mongoose.Schema({
	title: { type: String },
	pixels: { type: String }
});

module.exports = mongoose.model('Pumpkin', pumpkinSchema);
