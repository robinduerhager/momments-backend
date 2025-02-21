"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
// const express = require("express");
// const { PrismaClient } = require("@prisma/client");
const app = (0, express_1.default)();
// const prisma = new PrismaClient();
app.use(express_1.default.json());
// Define your routes here
app.get("/", (req, res) => {
    res.send("Hello World");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
