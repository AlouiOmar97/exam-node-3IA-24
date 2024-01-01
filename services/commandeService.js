var db = require('../database/database');
var socketIo = require('socket.io')



function socketIO(server) {
    const io = socketIo(server);
  
    io.on("connection",async (socket)=>{
        console.log("user connected with socket id"+socket.id);
        data={ user: "user1", msg: "msg from server"}
        socket.broadcast.emit("msg","new user is connected")
        const { Commande } = await db();
        const commandes = await Commande.findAll({ where :{ etat_livraison: false}});
        io.emit('msg', JSON.stringify(commandes))
       
       
       
       
       
       
      socket.on("livrer",async (data)=>{
            console.log(data);
            io.emit("msg",data)
            const { Commande }= await db()
            const commandeToUpdate = await Commande.findByPk(data.id);
            commandeToUpdate.etat_livraison = true;
            commandeToUpdate.nom_livreur = data.nom;
            await commandeToUpdate.save();
            const commandes = await Commande.findAll({ where :{ etat_livraison: false}});
            io.emit('msg', JSON.stringify(commandes))
            
      })

        socket.on("uTyping",(data)=>{
          socket.broadcast.emit("msg-typing",data)
        })

        socket.on('disconnect',()=>{
          io.emit('msg','user disconnected!!');
          });

         
      })
  
    return io;
  }

async function displayLivraison(req,res,next){

    res.render('livraison',{ title: 'Livraison'})
} 

/* GET users listing. */
async function findAll(req, res, next) {
  try {
    const { Commande } = await db();
    const commandes = await Commande.findAll();
    res.render('listCommande.twig', { title: 'Liste des Commandes', commandes: commandes });
  } catch (e) {
    console.log(e);
    res.status(500).send('Internal Server Error');
  }
}

async function findAllByAdresse(req, res, next) {
  try {
    const { Commande } = await db();
    const commandes = await Commande.findAll({ where :{ adresse: "Tunis"}});
    res.render('listCommande.twig', { title: 'Liste des Commandes à Tunis', commandes: commandes });
  } catch (e) {
    console.log(e);
    res.status(500).send('Internal Server Error');
  }
}


async function displayAddForm (req, res, next){
 
    res.render('addCommande.twig', { title: 'Ajouter Commande'});

};

async function createCommande(req, res, next) {
    const { Commande } = await db();
    const { produit, prix, adresse } = req.body;
    await Commande.create({produit, prix, adresse, etat_livraison: false, nom_livreur: "inconnu"});
    res.redirect('/commandes');
  }

async function displayUpdateForm (req, res, next){
    try {
      const { Commande } = await db();
      // Assuming you send the updated commande data in the request body
      const { id } = req.params;
      // Find the commande by ID
      const commandeToUpdate = await Commande.findByPk(id);
      // Check if the commande exists
      if (!commandeToUpdate) {
        return res.status(404).json({ error: 'Commande not found' });
      }
      res.render('updateCommande.twig', { title: 'Modifier Commande', commande: commandeToUpdate });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
 async function updateCommande(req, res){
    try {
      const { Commande } = await db();
      // Assuming you send the updated commande data in the request body
      const { produit, prix, adresse } = req.body;
      const { id } = req.params;
      // Find the commande by ID
      const commandeToUpdate = await Commande.findByPk(id);
      // Check if the commande exists
      if (!commandeToUpdate) {
        return res.status(404).json({ error: 'Commande not found' });
      }
      // Update the commande
      commandeToUpdate.produit = produit;
      commandeToUpdate.prix = prix;
      commandeToUpdate.adresse = adresse;
      await commandeToUpdate.save();
      // Send the updated commande as a response
      // res.json(commandeToUpdate);
      res.redirect('/commandes');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

async function deleteCommande(req, res, next){
    try {
      const { Commande } = await db();
      const { id } = req.params;
      // Find the commande by ID
      const commandeToDelete = await Commande.findByPk(id);
      // Check if the commande exists
      if (!commandeToDelete) {
        return res.status(404).json({ error: 'Commande not found' });
      }
      // Delete the commande
      await commandeToDelete.destroy();
      // Send a success message as a response
      //res.json({ message: 'Commande deleted successfully' });
      res.redirect('/commandes');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
  

module.exports= { findAll, findAllByAdresse, displayAddForm, createCommande, displayUpdateForm, updateCommande, deleteCommande, socketIO, displayLivraison }