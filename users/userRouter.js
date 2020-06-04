const express = require('express');

const router = express.Router();

const UsersDB = require("./userDb.js")
const PostsDB = require("../posts/postDb.js")

router.post('/', validateUser("name"), (req, res) => {
  UsersDB.insert(req.body)
    .then(newUser => res.status(201).json(newUser))
    .catch(err => res.status(500).json("Error adding New User"))
  });

router.post('/:id/posts', validateUserId, validatePost("text"), (req, res) => {
 const newPost = {...req.body, user_id: req.user}
  PostsDB.insert(newPost)
    .then(added => res.status(201).json(added))
    .catch(err => res.status(500).json("Error creating New Post"))
});

router.get('/', (req, res) => {
  UsersDB.get()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json("Error Retrieving Users Data"))
});

router.get('/:id', validateUserId, (req, res) => {
  UsersDB.getById(req.user)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json("Error Retrieving User Data"))
});

router.get('/:id/posts', validateUserId, (req, res) => {
  UsersDB.getUserPosts(req.user)
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json("Error Retrieving User's Posts"))
});

router.delete('/:id', validateUserId, (req, res) => {
  UsersDB.remove(req.user)
    .then(user => res.status(200).json(`User Number ${req.user} has been Deleted`))
    .catch(deleted => res.status(404).json("Error occurred when trying to Delete User"))
});

router.put('/:id', validateUserId, validateUser("name"), (req, res) => {
  UsersDB.update(req.user, req.body)
    .then(updated => res.status(200).json(`User Number ${req.user} has been Updated`))
    .catch(err => res.status(404).json("Error occurred when Updating the User Info"))
});

//custom middleware

function validateUserId(req, res, next) {
  const userID = Number(req.params.id)

  UsersDB.getById(userID)
    .then(user => {
      if (!user) {
        res.status(400).json({ message: "invalid user id" })
      } else {
        req.user = userID;
        next();
      }
    })
}

function validateUser(prop) {
  return function(req, res, next){
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({ message: "missing user data" })
    } else if (!req.body[prop]){
      res.status(400).json({ message: `missing required ${prop} field` })
    } else {
      next()
    }
  }
}

function validatePost(props) {
  return function(req, res, next){
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({ message: "missing post data" })
    } else if (!req.body[props]){
      res.status(400).json({ message: `missing required ${props} field` })
    } else {
      next()
    }
  }
}

module.exports = router;
