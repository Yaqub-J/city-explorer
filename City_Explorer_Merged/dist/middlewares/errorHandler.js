"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = exports.ValidationError = void 0;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class ServerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ServerError';
    }
}
exports.ServerError = ServerError;
