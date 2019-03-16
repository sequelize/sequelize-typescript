import {Router} from 'express';
import {Repository} from 'sequelize-typescript';

import {User} from './User';
import {Post} from '../posts/Post';

export const userRouterFactory = (
  userRepository: Repository<User>,
  postRepository: Repository<Post>,
  ) => Router()

    .get('/users', (req, res, next) =>
      userRepository.findAll({include: [postRepository]})
        .then(users => res.json(users))
        .catch(next)
    )

    .get('/users/:id', (req, res, next) =>
      userRepository.findById(req.params.id)
        .then(user => user
          ? res.json(user)
          : next({statusCode: 404}))
        .catch(next)
    )

    .post('/users', (req, res, next) =>
      userRepository.create(req.body)
        .then(user => res.json(user))
        .catch(next)
    )

;
