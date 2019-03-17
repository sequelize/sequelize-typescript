import {Router} from "express";
import {Post} from "./Post";

export const postRouterFactory = () => Router()

    .get('/posts', (req, res, next) =>
      Post.findAll()
        .then(posts => res.json(posts))
        .catch(next)
    )

    .get('/posts/:id', (req, res, next) =>
      Post.findByPk(req.params.id)
        .then(post => post
          ? res.json(post)
          : next({statusCode: 404}))
        .catch(next)
    )

    .post('/posts', (req, res, next) =>
      Post.create(req.body)
        .then(post => res.json(post))
        .catch(next)
    )

;
