import * as express from 'express';
import {userRouterFactory} from "./users/userRouterFactory";
import {sequelize} from "./database/sequelize";
import {User} from "./users/User";
import {json} from "body-parser";
import * as strongErrorHandler from "strong-error-handler";
import {Post} from "./posts/Post";
import {postRouterFactory} from "./posts/postRouterFactory";

const userRepository = sequelize.getRepository(User);
const postRepository = sequelize.getRepository(Post);

(async () => {
  const user = await userRepository.create();
  user.
})();

export const app = express();

app.use(json());

app.use(userRouterFactory(userRepository, postRepository));
app.use(postRouterFactory(postRepository));

app.use(strongErrorHandler({
  debug: true,
}));

