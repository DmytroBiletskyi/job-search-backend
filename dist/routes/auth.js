"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, desiredJobTitle, aboutMe } = req.body;
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = new User_1.default({
            email,
            password: hashedPassword,
            name,
            desiredJobTitle,
            aboutMe,
        });
        yield user.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: 'Invalid email or password' });
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid email or password' });
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1m',
        });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}));
router.get("/profile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.query;
    try {
        if (typeof email === 'string') {
            const user = yield User_1.default.findOne({ email });
            if (user) {
                res.status(200).json({ name: user.name, aboutMe: user.aboutMe, desiredJobTitle: user.desiredJobTitle });
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        else {
            res.status(400).json({ message: 'Invalid email parameter' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}));
exports.default = router;
