import otpGenerator from "otp-generator"

export default () => {
    const OTP_LENGTH = 6;
    const OTP_CONFIG = {
        digits: true,       // Include digits (0-9)
        lowerCaseAlphabets: true,   // Exclude alphabets (a-z, A-Z)
        upperCaseAlphabets: false,   // Irrelevant when alphabets are false
        specialChars: false // Exclude special characters
    };

    // Generate the OTP
    const OTP = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
    return OTP;
}