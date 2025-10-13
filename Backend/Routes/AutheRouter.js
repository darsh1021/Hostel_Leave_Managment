const { signup,login } = require('../Controllers/AuthController');
const { signupValidation ,loginValidation} = require('../Middlewares/AuthValidation');
const auth = require('../Middlewares/Auth');
const {saveForm,getAdmin,saveData,StoreNotification} = require('../Controllers/Fetch');
const {StoreApplication,StoreQR} = require('../Controllers/Storing');
const {updateApplication} = require('../Controllers/DataOperation');


const router = require('express').Router();

router.post('/login',loginValidation,login);
router.post('/signup',signupValidation,signup);
router.post('/saveForm',saveForm);
router.post('/saveData',saveData);//Rooms
router.post('/storeNotification',StoreNotification);
router.post('/storeApplication',StoreApplication);
router.post('/updateApplication',updateApplication);

router.post('/storeQR',StoreQR);

module.exports = router;