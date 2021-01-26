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
};

// definindo rotas
router.get('', BalancetesController.getBalancetes);
router.post('', validate([
  body('companyId').isISO8601(),
  body('date').isISO8601(),
  body('balanceSheet').isAlphanumeric(),
  body('timestamp').isISO8601(),
]), BalancetesController.addBalancete);

module.exports = router;
