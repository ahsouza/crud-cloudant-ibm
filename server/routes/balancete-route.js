// import dependencies and initialize the express router
const
 express = require('express'),
 { body, validationResult } = require('express-validator'),
 BalancetesController = require('../controllers/balancete-controller')

const router = express.Router();

// standardized validation error response
const validate = validations => {
  return async(req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)))

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({errors: errors.array()})
  }
}

// definindo rotas
router.get('/getAll', BalancetesController.getBalancetesSheet);
router.post('/save', BalancetesController.newBalancete);
router.put('/update/:id', BalancetesController.updateBalancete);
router.delete('/remove', BalancetesController.deleteBalancete);

module.exports = router;
