const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Medication = sequelize.define("medication", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
});

const Compatibility = sequelize.define("compatibility", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    medication1Id: { type: DataTypes.INTEGER, allowNull: false },
    medication2Id: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM(
        "strong_enhancement",
        "mild_enhancement",
        "reduction",
        "toxicity_increase",
        "no_data",
        "incompatible"
      ),
      allowNull: false
    },
    comment: { type: DataTypes.STRING }
  });
  
Medication.belongsToMany(Medication, {
    through: Compatibility,
    as: "Interactions",
    foreignKey: "medication1Id",
    otherKey: "medication2Id"
});
  

module.exports = {
    Medication,
    Compatibility
};
