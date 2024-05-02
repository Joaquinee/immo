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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var fs = __importStar(require("fs"));
var sharp_1 = __importDefault(require("sharp"));
function getDestination(req, file, cb) {
    cb(null, 'src/images/' + file.originalname);
}
var MyCustomStorage = /** @class */ (function () {
    function MyCustomStorage(opts) {
        this.getDestination = opts.destination || getDestination;
    }
    MyCustomStorage.prototype._handleFile = function (req, file, cb) {
        this.getDestination(req, file, function (err, path) {
            if (err)
                return cb(err);
            var outStream = fs.createWriteStream(path);
            var resizer = (0, sharp_1.default)().resize(200, 200).webp();
            resizer.on('error', cb);
            outStream.on('error', cb);
            outStream.on('finish', function () {
                cb(null, {
                    path: path,
                    size: outStream.bytesWritten,
                });
            });
            file.stream.pipe(resizer).pipe(outStream);
        });
    };
    MyCustomStorage.prototype._removeFile = function (req, file, cb) {
        fs.unlink(file.path, cb);
    };
    return MyCustomStorage;
}());
module.exports = function (opts) {
    return new MyCustomStorage(opts);
};
