const { DataTypes } = require('sequelize');
 
const Commande = (sequelize) => {
  const CommandeModel = sequelize.define('Commande', {
    produit: {
      type: DataTypes.STRING,
      allowNull: false
    },
    etat_livraison: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    prix: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    adresse: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nom_livreur: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
  return CommandeModel;
};
 
module.exports = Commande;