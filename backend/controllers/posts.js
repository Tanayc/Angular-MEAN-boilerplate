const Post = require("../models/post");


exports.createPost =   (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
    });
    // send back the created post Id
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath
        }
      });
    })
    .catch(error=> {
      res.status(500).json({
        message: "Creating a post failed"
      })
    });
  }

  exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      // check the result here to see the fields which can be used
      // in the if condition 'n' and nModified are the relevant fields
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json( {message: "Update Failed!"} )
      }
    })
    .catch(err => {
      res.status(500).json( {message: "Update Failed!"} )
    });
  }

  exports.getPosts = (req, res, next) => {
    // extract the req paarms as numbers
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts = null;
    if (pageSize && currentPage) {
      postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
    }
    postQuery.then(documents => {
      fetchedPosts = documents;
      return Post.count();
      })
      .then(count => {
        res.status(200).json({
          message: "Posts fetched successfully!",
          posts: fetchedPosts,
          maxPosts: count
        })
      })
      .catch(err => {
        res.status(500).json( {message: "Unable to retrieve posts!"} )
      });
    }

    exports.getPostsById = (req, res, next) => {
        Post.findById(req.params.id).then(post => {
          if (post) {
            res.status(200).json(post);
          } else {
            res.status(404).json({ message: "Post not found!" });
          }
        })
        .catch(err => {
          res.status(500).json( {message: "Unable to get post!"} )
        });
      }

    exports.deletePost = (req, res, next) => {
        Post.deleteOne({ _id: req.params.id, creator: req.userData.userId}).then(result => {
          console.log(result);
          // number of records n
          if (result.n > 0) {
            res.status(200).json({ message: "Delete successful!" });
          } else {
            res.status(401).json( {message: "Delete Failed!"} )
          }
        });
      }