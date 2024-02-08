const userRouter = require('express').Router();
const { getAuthorizedUserInfo, updateUser } = require('../controllers/users');
const { updateUserValidation } = require('../middlewares/celebrateValidation');

userRouter.get('/me', getAuthorizedUserInfo);

userRouter.patch('/me', updateUserValidation, updateUser);

module.exports = userRouter;
