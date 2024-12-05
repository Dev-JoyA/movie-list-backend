import { Sequelize } from 'sequelize';

// Initialize Sequelize connection
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  username: 'TJA',
  password: '1234',
  database: 'movielistdb',
  logging: console.log, // Optional, set to true for debugging SQL queries
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Export the Sequelize instance for use in models
export { sequelize, testConnection };
