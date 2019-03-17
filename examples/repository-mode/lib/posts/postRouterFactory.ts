import {Router} from "express";
import {Repository} from "sequelize-typescript";
import {Post} from "./Post";

export const postRouterFactory = (
  postRepository: Repository<Post>,
  ) => Router()

    .get('/posts', (req, res, next) =>
      postRepository.findAll()
        .then(posts => res.json(posts))
        .catch(next)
    )

    .get('/posts/:id', (req, res, next) =>
      postRepository.findByPk(req.params.id)
        .then(post => post
          ? res.json(post)
          : next({statusCode: 404}))
        .catch(next)
    )

    .post('/posts', (req, res, next) =>
      postRepository.create(req.body)
        .then(post => res.json(post))
        .catch(next)
    )

;
