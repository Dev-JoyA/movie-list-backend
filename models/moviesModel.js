import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/dbConnect.js';

const MovieList = sequelize.define('MovieList', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  poster: {
    type: DataTypes.BLOB,
    allowNull: true,
  },
  publishing_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  movie: {
    type: DataTypes.BLOB,
    allowNull: true,
  },
}, {
  tableName: 'movie_list',
  schema: 'movies', // Schema name
  timestamps: false, // Disable createdAt and updatedAt columns
});

export default MovieList;
