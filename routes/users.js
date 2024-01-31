const userRouter = require('express').Router();
const { getAuthorizedUserInfo, updateUser } = require('../controllers/users');

userRouter.get('/me', getAuthorizedUserInfo);

userRouter.patch('/me', updateUser);

module.exports = userRouter;
