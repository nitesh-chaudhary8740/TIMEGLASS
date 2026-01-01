export const validators = {
    /**
     * @description Validates a username format.
     * Checks: 
     * 1. Must start with a lowercase letter (`^[a-z]`).
     * 2. Must only contain lowercase letters, numbers, or underscores (`[a-z0-9_]`).
     * 3. Must be between 5 and 17 characters long (1 required start character + 4 to 16 more characters).
     */
    userName: (str) => /^[a-z][a-z0-9_]{4,16}$/.test(str),
    
    /**
     * @description Validates a basic email structure (local-part@domain.tld).
     * Checks:
     * 1. The string is not empty (`^...$`).
     * 2. Contains one or more non-whitespace, non-@ characters for the local part (`[^\s@]+`).
     * 3. Contains a literal '@'.
     * 4. Contains one or more non-whitespace, non-@ characters for the domain (`[^\s@]+`).
     * 5. Contains a literal dot (`.`).
     * 6. Contains one or more non-whitespace, non-@ characters for the TLD (`[^\s@]+`).
     */
    email: (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str),
    
    /**
     * @description Validates a strong password based on complexity and length.
     * Checks (using Lookaheads):
     * 1. Must contain at least one uppercase letter anywhere (`(?=.*[A-Z])`).
     * 2. Must contain at least one digit anywhere (`(?=.*\d)`).
     * 3. Must be between 8 and 64 characters long (`{8,64}`).
     * 4. Only allows letters (A-Z, a-z), digits, and the specified symbols (`@$!%*?&`).
     */
    password: (str) => /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,64}$/.test(str),
    
    /**
     * @description Validates a name/title string.
     * Checks:
     * 1. Must only contain letters (A-Z, a-z) and spaces (`[a-zA-Z\s]`).
     * 2. Must be between 2 and 50 characters long (`{2,50}`).
     */
    name: (str) => /^[a-zA-Z\s]{2,50}$/.test(str),
    
    /**
     * @description Utility for string cleanup (NOT a boolean validator).
     * Action:
     * 1. Replaces two or more consecutive spaces (`\s{2,}`) with a single space.
     * 2. Removes any leading or trailing whitespace (`.trim()`).
     */
    noExtraSpaces: (str) => str.replace(/\s{2,}/g, " ").trim(),
};
const name = "jOhn dOe smith-jones";

const titleCaseName = name.toLowerCase().replace(
    /\b\w/g, // Find the first word character (\w) at a word boundary (\b) globally (g)
    (char) => char.toUpperCase() // Replace the matched character with its uppercase version
);



