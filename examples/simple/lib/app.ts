import * as express from 'express';
import * as strongErrorHandler from 'strong-error-handler';
import {json} from 'body-parser';

import {sequelize} from './database/sequelize';
import {userRouterFactory} from './users/userRouterFactory';
import {postRouterFactory} from './posts/postRouterFactory';
import {User} from './users/User';
import {Post} from './posts/Post';

const userRepository = sequelize.getRepository(User);
const postRepository = sequelize.getRepository(Post);

export const app = express();

app.use(json());

app.use(userRouterFactory(userRepository, postRepository));
app.use(postRouterFactory(postRepository));

app.use(strongErrorHandler({
  debug: true,
}));

