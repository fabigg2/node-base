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
exports.userRepository = void 0;
const uuid_1 = require("uuid");
const user_model_1 = __importDefault(require("../../domain/models/user.model"));
exports.userRepository = {
    save: (userDto) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, lastname, email, password, isGoogle } = userDto;
        let user = new user_model_1.default({
            name,
            lastname,
            email,
            password,
            isGoogle: isGoogle || false
        });
        user.hash = (0, uuid_1.v5)('shop.com', uuid_1.v5.URL);
        return yield user.save();
    }),
    findOneById: (uid) => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_model_1.default.findById(uid);
    }),
    findOneByEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_model_1.default.findOne({ email });
    }),
    findOneByhash: (hash) => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_model_1.default.findOne({ hash });
    }),
    findMany: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_model_1.default.find();
    })
};
