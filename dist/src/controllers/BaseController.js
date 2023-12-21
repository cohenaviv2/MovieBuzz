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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    constructor(model) {
        this.model = model;
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield this.model.find();
                res.send(items);
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.params.id) {
                    const itemId = req.params.id;
                    const itemById = yield this.model.findById(itemId);
                    res.send(itemById);
                }
                else {
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const itemData = req.body;
                const newItem = yield this.model.create(itemData);
                res.status(201).json(newItem);
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    updateById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const itemId = req.params.id;
                const updatedItem = yield this.model.findByIdAndUpdate(itemId, req.body, {
                    new: true,
                });
                if (!updatedItem) {
                    return res.status(404).json({ error: "Item not found" });
                }
                res.status(200).json(updatedItem);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const itemId = req.params.id;
                const deletedItem = yield this.model.findByIdAndDelete(itemId);
                if (!deletedItem) {
                    return res.status(404).json({ error: "Comment not found" });
                }
                res.status(204).send();
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
}
exports.BaseController = BaseController;
const createController = (model) => {
    return new BaseController(model);
};
exports.default = createController;
//# sourceMappingURL=BaseController.js.map