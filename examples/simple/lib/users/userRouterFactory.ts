import {Router} from 'express';

import {User} from './User';
import {Post} from '../posts/Post';

export const userRouterFactory = () => Router()

    .get('/users', (req, res, next) =>
      User.findAll({include: [Post]})
        .then(users => res.json(users))
        .catch(next)
    )

    .get('/users/:id', (req, res, next) =>
      User.findByPk(req.params.id)
        .then(user => user
          ? res.json(user)
          : next({statusCode: 404}))
        .catch(next)
    )

    .post('/users', (req, res, next) =>
      User.create(req.body)
        .then(user => res.json(user))
        .catch(next)
    )

;
