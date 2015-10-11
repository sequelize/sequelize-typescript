var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (ErrorCode) {
    ErrorCode[ErrorCode["AuthenticationFailed"] = 0] = "AuthenticationFailed";
})(exports.ErrorCode || (exports.ErrorCode = {}));
var ErrorCode = exports.ErrorCode;
var CodeError = (function (_super) {
    __extends(CodeError, _super);
    function CodeError(message, code) {
        _super.call(this);
        this.message = message;
        this.code = code;
    }
    return CodeError;
})(Error);
exports.CodeError = CodeError;
//# sourceMappingURL=CodeError.js.map