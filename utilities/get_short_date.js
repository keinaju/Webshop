module.exports = function get_short_date(date_object) {
    let year = date_object.getFullYear();

    let month = date_object.getMonth() + 1;
    if (month < 10) month = '0' + month; //Ensure leading 0

    let day = date_object.getDate();
    if (day < 10) day = '0' + day;

    return year + '-' + month + '-' + day;
};