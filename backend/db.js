const sql = require('mssql/msnodesqlv8')

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
}

module.exports = { sql, config }