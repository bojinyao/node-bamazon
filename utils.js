let mysql = require("mysql");

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
    }
}


