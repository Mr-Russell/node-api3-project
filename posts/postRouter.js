const express = require('express');

const router = express.Router();

const PostsDB = require("./postDb.js")

router.get('/', (req, res) => {
  PostsDB.get()
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json("An Error occurred when fetching Posts"))
});

router.get('/:id', validatePostId, (req, res) => {
  PostsDB.getById(req.post)
    .then(post => res.status(200).json(post))
    .catch(err => res.status(500).json(`An Error occurred when fetching Post with ID ${req.post}`))
});

router.delete('/:id', validatePostId, (req, res) => {
  PostsDB.remove(req.post)
    .then(deleted => res.status(200).json(`Post ID ${req.post} has been Deleted`))
    .catch(err => res.status(404).json(`An Error occurred when Deleting Post ID ${req.post}`))
});

router.put('/:id', validatePostId, (req, res) => {
  PostsDB.update(req.post, req.body)
    .then(updated => res.status(200).json(`Post ID ${req.post} has been Updated`))
    .catch(err => res.status(404).json(`An Error occurred when Updating Post ID ${req.post}`))
});

// custom middleware

function validatePostId(req, res, next) {
  const postID = Number(req.params.id)

  PostsDB.getById(postID)
    .then(post => {
      if (!post) {
        res.status(400).json({ message: "invalid Post Id" })
      } else {
        req.post = postID;
        next();
      }
    })
}

module.exports = router;
