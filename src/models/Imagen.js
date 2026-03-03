const sequelize = require("../db");

const { Model, DataTypes } = require("sequelize");

class Imagen extends Model {}

Imagen.init(
  {
    id_imagen: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
 /*    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    observaciones: {
      type: DataTypes.STRING,
    }, */
    imagen: {
      type: DataTypes.BLOB('long'),
      
    },
  },
  {
    sequelize,
    modelName: "imagenes",
    timestamps: false,
    freezeTableName:true,
  }
);

module.exports = Imagen;
