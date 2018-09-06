const express = require("express");
const extractFile = require("../middleware/file")
const router = express.Router();
const postController = require("../controllers/posts");
const checkAuth = require('../middleware/check-auth');



// checkAuth middleware function reference is passed
// similar to multer which is also acting as a middleware
router.post(
  "", 
  checkAuth,
  extractFile,
  postController.createPost
);

router.put(
  "/:id",
  checkAuth,
  extractFile,
  postController.updatePost
);

router.get("", postController.getPosts);

router.get("/:id", postController.getPostsById);

router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
