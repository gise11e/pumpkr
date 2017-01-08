const router = require('express').Router();
const pumpkinsController = require('../controllers/pumpkinsController');

router.get('/pumpkins', pumpkinsController.index);

module.exports = router;


router.route('/pumpkins')
	.get(pumpkinsController.index)
	.post(pumpkinsController.create);

  router.route('/pumpkins/:id')
  	.get(pumpkinsController.show)
    .put(pumpkinsController.update)
    .delete(pumpkinsController.delete);
