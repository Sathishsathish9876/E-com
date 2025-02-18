const express = require("express");
const router = express.Router();
const app = express();
const cors = require("cors");

//MIDDLEWARE

app.use(cors());
app.use(express.json());

const { getRegister, postRegister, login } = require("../controllers/RegisterController");


router.get('/register', getRegister);
router.post('/register', postRegister);
router.post("/login", login)


module.exports = router;
