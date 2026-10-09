import dotenv from 'dotenv';
dotenv.config();

/**
 * Clean and format mobile number into E.164 standard (e.g., +919840012345)
 * @param {string} mobile 
 * @returns {string}
 */
export const formatMobileE164 = (mobile) => {
  if (!mobile) return '';
  let cleaned = String(mobile).replace(/[^\d+]/g, '');
  
  // Default to +91 prefix for 10-digit Indian mobile numbers if country code is missing
  if (/^\d{10}$/.test(cleaned)) {
    cleaned = `+91${cleaned}`;
  } else if (/^91\d{10}$/.test(cleaned)) {
    cleaned = `+${cleaned}`;
  } else if (!cleaned.startsWith('+') && cleaned.length > 5) {
    cleaned = `+${cleaned}`;
  }
  return cleaned;
};

/**
 * Send SMS using Twilio REST API
 * @param {string} toMobile 
 * @param {string} otpCode 
 * @returns {Promise<{ success: boolean, message: string, twilioSid?: string }>}
 */
export const sendOtpSms = async (toMobile, otpCode) => {
  const accountSid = (process.env.TWILIO_ACCOUNT_SID || '').trim();
  const authToken = (process.env.TWILIO_AUTH_TOKEN || '').trim();
  const fromNumber = (process.env.TWILIO_PHONE_NUMBER || '').trim();
  const messagingServiceSid = (process.env.TWILIO_MESSAGING_SERVICE_SID || '').trim();

  const formattedTo = formatMobileE164(toMobile);
  const smsBody = `Your Granite & Tile MMS verification code is: ${otpCode}. Valid for 5 minutes. Do not share this code with anyone.`;

  // Check if Twilio credentials are fully configured
  const isTwilioConfigured = accountSid && accountSid !== 'your_twilio_account_sid' &&
    authToken && authToken !== 'your_twilio_auth_token' &&
    (fromNumber || messagingServiceSid);

  if (!isTwilioConfigured) {
    console.warn(`\n[SMS Service Warning]: Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER) are not fully configured in backend/.env.`);
    console.warn(`[SMS Service Mock]: OTP code '${otpCode}' created for ${formattedTo}. To receive real SMS, configure Twilio credentials in backend/.env.\n`);
    
    return {
      success: true,
      message: 'OTP generated. (Twilio SMS credentials pending in backend/.env)',
      mockMode: true,
      otpCode
    };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const params = new URLSearchParams();
    params.append('To', formattedTo);
    params.append('Body', smsBody);
    
    if (messagingServiceSid) {
      params.append('MessagingServiceSid', messagingServiceSid);
    } else {
      params.append('From', fromNumber);
    }

    const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await response.json();

    if (response.ok && data.sid) {
      console.log(`[Twilio SMS Success]: Sent OTP to ${formattedTo} (Message SID: ${data.sid})`);
      return {
        success: true,
        message: `SMS successfully sent to ${formattedTo}.`,
        twilioSid: data.sid,
        mockMode: false,
        otpCode
      };
    } else {
      const errMsg = data.message || data.error_message || 'Failed to deliver SMS via Twilio.';
      console.error(`[Twilio SMS Error]: Code ${data.code} - ${errMsg}`);
      console.warn(`[SMS Service Fallback]: Twilio failed. Falling back to Demo OTP mode with code '${otpCode}'.`);
      return {
        success: true,
        message: `Twilio delivery note: ${errMsg}`,
        mockMode: true,
        otpCode
      };
    }
  } catch (error) {
    console.error('[SMS Service Exception]:', error);
    return {
      success: true,
      message: `SMS network error. Using Demo OTP mode.`,
      mockMode: true,
      otpCode
    };
  }
};
