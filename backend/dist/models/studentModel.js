"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const studentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: [true, "Email already registered"],
        validate: [validator_1.default.isEmail, "Please Enter a valid Email"],
    },
    number: {
        type: Number,
        required: [true, "Please enter your mobile number"],
        maxLength: [10, "Mobile number should be of 10 digits"],
        minLength: [10, "Mobile number should be of 10 digits"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    type: {
        type: String,
        default: "Student",
    },
    rollNumber: {
        type: Number,
        unique: true,
    },
    deviceHash: String,
    createdAT: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: new Date(),
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});
// ye method har bar save hone se pehle chalegi
studentSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // agr changes hai to password ko hash krke save kro
        if (!this.isModified("password")) {
            // ye condition isliye kyunki hashing intensive hai and har bar nhi krna
            next();
        }
        this.password = yield bcryptjs_1.default.hash(this.password, 10); // hashes cannot be converted backwards
        //@ts-ignore
        const lastDocument = yield this.constructor.findOne().sort({ _id: -1 });
        this.rollNumber = lastDocument.rollNumber + 1;
    });
});
// // JWT TOKEN
studentSchema.methods.getJWTToken = function () {
    const object = { id: this._id, hash: this.deviceHash };
    //@ts-ignore
    return jsonwebtoken_1.default.sign(object, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE, // create a jwt token with _id and deviceHash
    });
};
// // Compare Password
studentSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        // compare method password ka hash bana ke this.password ke hash se compare krti hai
        return yield bcryptjs_1.default.compare(password, this.password);
    });
};
// // Generating Password Reset Token
studentSchema.methods.getResetPasswordToken = function () {
    // Generating random data
    const resetToken = crypto_1.default.randomBytes(20).toString("hex");
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};
exports.default = mongoose_1.default.model("Student", studentSchema);
