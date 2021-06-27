const router = require('express').Router();
const postCtrl = require('../controllers/postCtrl');
const auth = require('../middleware/auth');

//create a post
router.post('/', auth, postCtrl.createPost);
//update a post
router.put('/:id', auth, postCtrl.updatePost);
//delete a post
router.delete('/:id', auth, postCtrl.deletePost);
//like /dislike a post
router.get('/:id/like', auth, postCtrl.likePost);
//get a post
router.get('/:id', postCtrl.getPost)
//get timeline posts
router.get('/timeline/all', auth, postCtrl.timeline)
//get user's all posts
router.get('/profile/:username', postCtrl.getUserPosts)

module.exports = router;
