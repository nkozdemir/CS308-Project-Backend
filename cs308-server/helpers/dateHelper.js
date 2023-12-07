function getCurrentDateTime() {
    const date = new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul', hour12: false });
    console.log("getCurrentDateTime: ", date);

    return date;
}

module.exports = {
    getCurrentDateTime,
}