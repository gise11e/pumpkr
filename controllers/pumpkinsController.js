const Pumpkin = require('../models/pumpkin');
const fs = require('fs');

function pumpkinsIndex(req, res) {
	Pumpkin.find({}, (err, pumpkins) => {
		if(err) {
			res.status(500).json({ error: err });
		}
		var pumpkinsWithImage = [];
		for (var i=0; i<pumpkins.length; i++) {
		 var pumpkin = pumpkins[i].toObject();
		 pumpkin.previewSrc = '//' + req.get('host') + '/images/' + pumpkins[i]._id + '.png';
		 pumpkinsWithImage.push(pumpkin);
		}
		res.json(pumpkinsWithImage);
	});
}


function pumpkinsCreate(req, res) {

	var encodedImage = req.body.preview.replace(/^data:image\/png;base64,/, "");

	Pumpkin.create(req.body, (err, pumpkin) => {
		if (err) {
			res.status(500).json({ error: err});
		}
		else {
			let filename = "public/images/" + pumpkin._id + ".png";
			fs.writeFile(filename, encodedImage, 'base64', function(err) {
			  res.status(500);
			});
			res.status(201).json(pumpkin);
		}
	});
}



function pumpkinsShow(req, res) {
	Pumpkin.findById(req.params.id, (err, pumpkin) => {
		if(err) res.status(500).json({ error: err});
		res.json(pumpkin);
	});
}

function pumpkinsUpdate(req, res) {
User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
		res.json(pumpkin);
	});
}

function pumpkinsDelete(req, res) {
	Pumpkin.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			res.status(500).json({ error: err});
		}
		res.send(204);
	});
}


module.exports =  {
	index: pumpkinsIndex,
  create: pumpkinsCreate,
  show: pumpkinsShow,
  update: pumpkinsUpdate,
  delete: pumpkinsDelete
};
