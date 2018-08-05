module.exports = {
    /**
     * Check if number is strictly an integer.
     * @param {number} num 
     * @returns {boolean}
     */
    isInteger(num) {
        return /-?[\d]+/.test(num) && num % 1 === 0;
    }
}


