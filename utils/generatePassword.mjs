import otpGenerator from "otp-generator";

export default () => {
    const Password_LENGTH = 6;
    const Password_CONFIG = {
        digits: true,       // Include digits (0-9)
        lowerCaseAlphabets: false,   // Exclude alphabets (a-z, A-Z)
        upperCaseAlphabets: false,   // Irrelevant when alphabets are false
        specialChars: false // Exclude special characters
    };

    // Generate the Password
    const Password = otpGenerator.generate(Password_LENGTH, Password_CONFIG);
    return Password;
}
