import * as express from 'express';
import * as strongErrorHandler from 'strong-error-handler';
import {json} from 'body-parser';

import './database/sequelize';
import {userRouterFactory} from './users/userRouterFactory';
import {postRouterFactory} from './posts/postRouterFactory';

export const app = express();

app.use(json());

app.use(userRouterFactory());
app.use(postRouterFactory());

app.use(strongErrorHandler({
  debug: true,
}));

