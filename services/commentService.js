var db = require('../database/database');
/* GET users listing. */
async function findAll(req, res, next) {
  try {
    const { Comment } = await db();
    const comments = await Comment.findAll();
    res.render('form.twig', { title: 'My form', comments: comments });
  } catch (e) {
    console.log(e);
    res.status(500).send('Internal Server Error');
  }
}

async function createComment(req, res, next) {
    const { Comment } = await db();
    const { title } = req.body;
    await Comment.create({title});
    res.redirect('/forms');
  }

async function displayUpdateForm (req, res, next){
    try {
      const { Comment } = await db();
      // Assuming you send the updated comment data in the request body
      const { id } = req.params;
      // Find the comment by ID
      const commentToUpdate = await Comment.findByPk(id);
      // Check if the comment exists
      if (!commentToUpdate) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      res.render('formupdate.twig', { title: 'Update form', comment: commentToUpdate });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
 async function updateComment(req, res){
    try {
      const { Comment } = await db();
      // Assuming you send the updated comment data in the request body
      const { title } = req.body;
      const { id } = req.params;
      // Find the comment by ID
      const commentToUpdate = await Comment.findByPk(id);
      // Check if the comment exists
      if (!commentToUpdate) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      // Update the comment
      commentToUpdate.title = title;
      await commentToUpdate.save();
      // Send the updated comment as a response
      // res.json(commentToUpdate);
      res.redirect('/forms');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

async function deleteComment(req, res, next){
    try {
      const { Comment } = await db();
      const { id } = req.params;
      // Find the comment by ID
      const commentToDelete = await Comment.findByPk(id);
      // Check if the comment exists
      if (!commentToDelete) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      // Delete the comment
      await commentToDelete.destroy();
      // Send a success message as a response
      //res.json({ message: 'Comment deleted successfully' });
      res.redirect('/forms');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
  

module.exports= { findAll, createComment, displayUpdateForm, updateComment, deleteComment }