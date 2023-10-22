const stripeController = require('../Controllers/StripeController');
const passport = require('passport');

module.exports = (app) => {


    app.post('/api/stripe/create',  passport.authenticate('jwt', { session: false }), stripeController.createPayment);

}