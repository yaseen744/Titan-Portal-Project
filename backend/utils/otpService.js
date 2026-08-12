/**
 * OTP delivery is intentionally split from OTP generation/storage/verification
 * (that part lives in controllers/authController.js and is fully working
 * end-to-end). This file only handles the "send the code somewhere" step.
 *
 * Real WhatsApp delivery needs a WhatsApp Business API account (e.g. Meta's
 * Cloud API, or a reseller like Twilio/Gupshup) - that requires the
 * project owner's own business account, a verified sender number, and a
 * pre-approved message template, none of which can be provisioned from
 * here. Until that's wired up, this logs the code to the server console
 * and (only when DEV_EXPOSE_OTP=true in .env) returns it in the API
 * response so the whole Forgot Password flow can be tested right now.
 *
 * To go live with real WhatsApp delivery later:
 *   1. Get a WhatsApp Business API account + approved OTP template.
 *   2. npm install the provider's SDK (e.g. `twilio`).
 *   3. Replace the body of sendOtpWhatsApp() below with a real API call.
 *   4. Set DEV_EXPOSE_OTP=false in .env.
 */
export async function sendOtpWhatsApp(phone, code) {
  console.log(`\n[OTP] Would send WhatsApp message to ${phone}: "Your Titan Portal verification code is ${code}. It expires in 5 minutes."\n`)
  return { sent: true, channel: 'console-dev-stub' }
}
