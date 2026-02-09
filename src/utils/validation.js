// ✅ Reusable Validation Functions

/**
 * Validate email format
 * @param {string} email
 * @returns {string} Error message or empty string
 */
export const validateEmail = (email) => {
    if (!email || email.trim() === "") {
        return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Invalid email address";
    }

    return "";
};

/**
 * Validate password strength
 * @param {string} password
 * @returns {string} Error message or empty string
 */
export const validatePassword = (password) => {
    if (!password || password.trim() === "") {
        return "Password is required";
    }

    if (password.length < 8) {
        return "Password must be at least 8 characters";
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
        return "Password must contain uppercase, lowercase, number, and special character";
    }

    return "";
};

/**
 * Validate confirm password
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {string} Error message or empty string
 */
export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword || confirmPassword.trim() === "") {
        return "Please confirm your password";
    }

    if (password !== confirmPassword) {
        return "Passwords do not match";
    }

    return "";
};

/**
 * Validate required field
 * @param {string} value
 * @param {string} fieldName
 * @returns {string} Error message or empty string
 */
export const validateRequired = (value, fieldName = "This field") => {
    if (!value || value.toString().trim() === "") {
        return `${fieldName} is required`;
    }
    return "";
};

/**
 * Get password strength level
 * @param {string} password
 * @returns {object} {level: string, color: string, text: string}
 */
export const getPasswordStrength = (password) => {
    if (!password) return { level: 0, color: "gray", text: "" };

    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return { level: 1, color: "red", text: "Weak" };
    if (strength <= 4) return { level: 2, color: "yellow", text: "Medium" };
    return { level: 3, color: "green", text: "Strong" };
};

/**
 * Validate phone number
 * @param {string} phone
 * @param {string} fieldName
 * @returns {string} Error message or empty string
 */
export const validatePhone = (phone, fieldName = "Phone number") => {
    if (!phone || phone.trim() === "") {
        return `${fieldName} is required`;
    }

    // Remove spaces, dashes, and parentheses
    const cleanPhone = phone.replace(/[\s\-()]/g, "");
    
    // Check if it contains only digits and has reasonable length (8-15 digits)
    const phoneRegex = /^\d{8,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
        return "Invalid phone number format";
    }

    return "";
};

/**
 * Validate passport number
 * @param {string} passport
 * @returns {string} Error message or empty string
 */
export const validatePassport = (passport) => {
    if (!passport || passport.trim() === "") {
        return "Passport number is required";
    }

    // Passport usually has 6-9 alphanumeric characters
    const passportRegex = /^[A-Z0-9]{6,9}$/i;
    if (!passportRegex.test(passport.replace(/[\s\-]/g, ""))) {
        return "Invalid passport format (6-9 characters)";
    }

    return "";
};

/**
 * Validate name (only letters and spaces)
 * @param {string} name
 * @param {string} fieldName
 * @returns {string} Error message or empty string
 */
export const validateName = (name, fieldName = "Name") => {
    if (!name || name.trim() === "") {
        return `${fieldName} is required`;
    }

    if (name.trim().length < 2) {
        return `${fieldName} must be at least 2 characters`;
    }

    const nameRegex = /^[a-zA-Z\s.'-]+$/;
    if (!nameRegex.test(name)) {
        return `${fieldName} can only contain letters, spaces, and basic punctuation`;
    }

    return "";
};

/**
 * Validate date (not in future, person must be at least 10 years old)
 * @param {string} date
 * @param {string} fieldName
 * @returns {string} Error message or empty string
 */
export const validateDateOfBirth = (date, fieldName = "Date of birth") => {
    if (!date || date.trim() === "") {
        return `${fieldName} is required`;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - selectedDate.getFullYear();

    if (selectedDate > today) {
        return `${fieldName} cannot be in the future`;
    }

    if (age < 10) {
        return "You must be at least 10 years old";
    }

    if (age > 120) {
        return "Please enter a valid date of birth";
    }

    return "";
};

/**
 * Validate zipcode/postal code
 * @param {string} zipcode
 * @returns {string} Error message or empty string
 */
export const validateZipcode = (zipcode) => {
    if (!zipcode || zipcode.trim() === "") {
        return "Zipcode/Postal code is required";
    }

    // Accept various postal code formats (alphanumeric, 3-10 characters)
    const zipcodeRegex = /^[A-Z0-9\s\-]{3,10}$/i;
    if (!zipcodeRegex.test(zipcode)) {
        return "Invalid zipcode format";
    }

    return "";
};

/**
 * Validate select/dropdown (ensure a value is selected)
 * @param {string} value
 * @param {string} fieldName
 * @returns {string} Error message or empty string
 */
export const validateSelect = (value, fieldName = "This field") => {
    if (!value || value === "" || value === "Select" || value === "Code") {
        return `Please select ${fieldName.toLowerCase()}`;
    }
    return "";
};

/**
 * Validate test score (numeric, within range)
 * @param {string} score
 * @param {string} fieldName
 * @param {number} min
 * @param {number} max
 * @returns {string} Error message or empty string
 */
export const validateScore = (score, fieldName = "Score", min = 0, max = 100) => {
    if (!score || score.trim() === "") {
        return `${fieldName} is required`;
    }

    const numScore = parseFloat(score);
    if (isNaN(numScore)) {
        return `${fieldName} must be a number`;
    }

    if (numScore < min || numScore > max) {
        return `${fieldName} must be between ${min} and ${max}`;
    }

    return "";
};
