const mysql = require("mysql");
const fs = require("fs");
const Table = require("cli-table");

module.exports = {
    /**
     * Check if number is strictly an integer.
     * @param {number} num 
     * @returns {boolean}
     */
    isInteger(num) {
        return /-?[\d]+/.test(num) && num % 1 === 0;
    },

    /**
     * Check if number is a signed float.
     * @param {number} num 
     */
    isNumber(num) {
        return /^-?\d+\.?\d*$/.test(num);
    },

    /**
     * Rounding a number to decimal places IF necessary.
     * Solution from: https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
     * @param {number} num 
     */
    roundToTwo(num) {    
        return +(Math.round(num + "e+2")  + "e-2");
    },

    /**
     * A somewhat convenient way to make fast DB queries.
     * Query result, field will be passed to callback.
     * @requires mysql
     * @param {JSON} server 
     * @param {string} sql 
     * @callback fn
     */
    queryDB(server, sql, fn=null) {
        let connection = mysql.createConnection(server);
        connection.query(
            {
                sql : sql
            }, 
            function(error, result, field) {
                if (error) {
                    console.log(error);
                    return;
                }
                if (fn) {
                    fn(result, field);
                }
            }
        )
        connection.end();
    },
    
    /**
     * Returns if a specific file path exists.
     * @param {string} path 
     * @return {boolean}
     */
    fileExists(path) {
        return fs.existsSync(path);
    },

    /**
     * Making consistent customized tables for this App
     * @param {rowDataPacket[]} queryResult 
     * @param {string[]} headers 
     * @param {string[]} columns
     * @return {table}
     */
    makeCustomTable(queryResult, headers, columns = null) {
        let table = new Table({
            chars: this.customTable
        });
        table.push(headers.map(h => h.verbose));
        queryResult.forEach(rawDataPacket => {
            if (columns) {
                let entries = Object.entries(rawDataPacket);
                let keep = entries.filter(pair => columns.includes(pair[0]));
                table.push(keep.map(pair => pair[1]));
            } else {
                table.push(Object.values(rawDataPacket));
            }
        });
        return table;
    },

    colorTheme : {
        silly: 'rainbow',
        input: 'grey',
        verbose: 'cyan',
        prompt: 'grey',
        success: 'green',
        data: 'grey',
        help: 'cyan',
        warn: 'yellow',
        info: 'blue',
        error: 'red'
    }, 
    customTable : {
        'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' 
    }
}


