function OTPValidator(req, res, next) {
  console.log('otp processing');
  next();
}

module.exports = OTPValidator;