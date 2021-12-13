const generate10DigitAlphaNumeric = () => {
    return Math.random().toString(36).substr(2, 10)
}

module.exports = {
    generate10DigitAlphaNumeric
}