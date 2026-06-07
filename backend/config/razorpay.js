const Razorpay = require("razorpay")

const isPlaceholderValue = (value = "") =>
  !value || value.startsWith("your-razorpay-")

exports.isDemoPaymentEnabled = () =>
  String(process.env.DEMO_PAYMENT_MODE || "").toLowerCase() === "true"

const getRazorpayCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY
  const keySecret = process.env.RAZORPAY_SECRET

  return {
    keyId,
    keySecret,
    isConfigured:
      !isPlaceholderValue(keyId) && !isPlaceholderValue(keySecret),
  }
}

exports.getRazorpayInstance = () => {
  const { keyId, keySecret, isConfigured } = getRazorpayCredentials()

  if (!isConfigured) {
    return null
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  })
}

exports.getRazorpayKeyId = () => {
  const { keyId, isConfigured } = getRazorpayCredentials()
  return isConfigured ? keyId : null
}

exports.getRazorpayConfigError = () => {
  const { isConfigured } = getRazorpayCredentials()

  if (isConfigured) {
    return null
  }

  return "Razorpay is not configured. Set valid RAZORPAY_KEY and RAZORPAY_SECRET in the backend environment."
}
