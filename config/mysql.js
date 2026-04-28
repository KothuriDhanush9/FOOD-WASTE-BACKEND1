const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE,   // ✅ FIXED
  process.env.MYSQLUSER,       // ✅ FIXED
  process.env.MYSQLPASSWORD,   // ✅ FIXED
  {
    host: process.env.MYSQLHOST,   // ✅ FIXED
    port: process.env.MYSQLPORT || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected successfully');

    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectMySQL };