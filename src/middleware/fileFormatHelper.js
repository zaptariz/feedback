/******************************************************
*                    FileSizeFormat
* @param {Number} bytes
* @param {number} decimal

    bytes is size of the input file
    decimal  =>  How many digit after the '.' notation

* @returns {function}
*******************************************************/

const fileformat = (bytes, decimal) => {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];

}

module.exports = {
    fileformat
}