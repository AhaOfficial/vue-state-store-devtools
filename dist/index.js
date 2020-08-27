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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var diff_1 = require("./diff");
var Flatted = __importStar(require("flatted"));
var vue_1 = __importDefault(require("vue"));
var vuex_1 = __importDefault(require("vuex"));
/**
 * Processing points for nuxt
 */
var target = typeof window !== 'undefined'
    ? window
    : typeof global !== 'undefined'
        ? global
        : {};
/**
 * Contains the hook variable space
 * provided by the vue-devtools.
 */
var devtoolsHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__;
/**
 * Contains the vuex store to be
 * injected into the vue-devtools.
 */
exports.devtoolsVuexStore = undefined;
var isTryingInit = false;
var initAfterRegisterQueue = [];
/**
 * Starts a sync with vue-devtools.
 * Only stores created after
 * init invoke are connected to devtools.
 *
 * @param option IDevtoolsOption
 */
exports.devtoolsInit = function (option) {
    if (option === void 0) { option = {
        enableToastMessage: true
    }; }
    return __awaiter(void 0, void 0, void 0, function () {
        var _i, initAfterRegisterQueue_1, initAfterRegisterItem;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (exports.devtoolsVuexStore)
                        return [2 /*return*/];
                    if (!devtoolsHook)
                        return [2 /*return*/];
                    // For using vue obserber in vuex
                    vue_1["default"].use(vuex_1["default"]);
                    isTryingInit = true;
                    try {
                        if (!vuex_1["default"]
                            || typeof vuex_1["default"]['version'] === 'undefined'
                            || typeof vuex_1["default"]['install'] === 'undefined') {
                            if (option.enableToastMessage && target.__VUE_DEVTOOLS_TOAST__)
                                target.__VUE_DEVTOOLS_TOAST__('[Vue-State-Store] Failed to import Vuex .');
                            isTryingInit = false;
                            return [2 /*return*/];
                        }
                    }
                    catch (e) { }
                    exports.devtoolsVuexStore = new vuex_1["default"].Store({ strict: false });
                    target.devtoolsVuexStore = exports.devtoolsVuexStore;
                    injectStore(exports.devtoolsVuexStore);
                    if (option.enableToastMessage && target.__VUE_DEVTOOLS_TOAST__)
                        target.__VUE_DEVTOOLS_TOAST__('Enabled Vue-State-Store');
                    _i = 0, initAfterRegisterQueue_1 = initAfterRegisterQueue;
                    _a.label = 1;
                case 1:
                    if (!(_i < initAfterRegisterQueue_1.length)) return [3 /*break*/, 4];
                    initAfterRegisterItem = initAfterRegisterQueue_1[_i];
                    return [4 /*yield*/, exports.devtoolsBind(initAfterRegisterItem[0], initAfterRegisterItem[1])];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    initAfterRegisterQueue = [];
                    isTryingInit = false;
                    return [2 /*return*/];
            }
        });
    });
};
exports.devtoolsStoreMap = {};
/**
 * Connect the vue-state-store
 * to the vuex store.
 */
exports.devtoolsBind = function (store, storeName) { return __awaiter(void 0, void 0, void 0, function () {
    var moduleInstance, beforeData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (isTryingInit) {
                    initAfterRegisterQueue.push([store, storeName]);
                    return [2 /*return*/];
                }
                if (!devtoolsHook)
                    return [2 /*return*/];
                if (!storeName)
                    return [2 /*return*/];
                if (!!exports.devtoolsVuexStore) return [3 /*break*/, 2];
                return [4 /*yield*/, exports.devtoolsInit()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (!exports.devtoolsVuexStore)
                    return [2 /*return*/];
                if (typeof exports.devtoolsStoreMap[storeName] !== 'undefined') {
                    console.warn('Vue-State-Store can track only one object value initially registered if the state store name is the same.');
                    return [2 /*return*/];
                }
                exports.devtoolsStoreMap[storeName] = store;
                moduleInstance = {
                    namespaced: true,
                    state: function () { return store.get(); }
                };
                exports.devtoolsVuexStore.registerModule(storeName, moduleInstance);
                beforeData = undefined;
                store.subscribe(function (changedData) {
                    var payload = {
                        diff: {},
                        stacktrace: []
                    };
                    var type = "" + storeName;
                    try {
                        var stack = traceParser(new Error('vue-state-store').stack);
                        for (var i = 1; i <= 2; i++)
                            stack.sub.shift();
                        var fullStack = [];
                        for (var _i = 0, _a = stack.sub; _i < _a.length; _i++) {
                            var stackItem = _a[_i];
                            fullStack.push(stackItem.functionName + " (" + stackItem.fileName + ":" + stackItem.lineNumber + stackItem.columnNumber + ")");
                        }
                        payload.stacktrace = fullStack;
                        type = type + " Mutation";
                    }
                    catch (e) { }
                    // Reflects the value of the vue-state-store
                    // changedData in the proxy of the vuex .
                    exports.devtoolsVuexStore.state[storeName] = changedData;
                    // The value that is caught overlapping Proxy is
                    // shared between vuex and vue-state-store .
                    exports.devtoolsVuexStore.replaceState(exports.devtoolsVuexStore.state);
                    // If it is the first value, it does not generate an event.
                    if (beforeData === undefined) {
                        beforeData = Flatted.parse(Flatted.stringify(changedData));
                        return;
                    }
                    // Apply the changed value.
                    try {
                        var diff = diff_1.Operational.diff(beforeData, changedData);
                        if (diff) {
                            payload.diff = diff_1.Operational.changelogs(diff, beforeData);
                            // payload.diffFormatted = `${Operational.changelogsFormatted({
                            //   diff,
                            //   format: 'console',
                            //   original: beforeData
                            // })})`
                        }
                    }
                    catch (e) { }
                    // Backup Before Data
                    beforeData = Flatted.parse(Flatted.stringify(changedData));
                    devtoolsHook.emit('vuex:mutation', {
                        payload: payload,
                        type: type
                    });
                });
                return [2 /*return*/];
        }
    });
}); };
/**
 * Insert the store into the Devtool.
 */
var injectStore = function (store) {
    var hook = devtoolsHook;
    // * Force vuex:init sequence.
    hook.store = store;
    hook.initialState = JSON.parse(JSON.stringify(store.state));
    var origReplaceState = store.replaceState.bind(store);
    store.replaceState = function (state) {
        hook.initialState = JSON.parse(JSON.stringify(state));
        origReplaceState(state);
    };
    // Dynamic modules
    var origRegister, origUnregister;
    if (store.registerModule) {
        hook.storeModules = [];
        origRegister = store.registerModule.bind(store);
        store.registerModule = function (path, module, options) {
            if (typeof path === 'string')
                path = [path];
            hook.storeModules.push({ path: path, module: module, options: options });
            origRegister(path, module, options);
        };
        origUnregister = store.unregisterModule.bind(store);
        store.unregisterModule = function (path) {
            if (typeof path === 'string')
                path = [path];
            var key = path.join('/');
            var index = hook.storeModules.findIndex(function (m) { return m.path.join('/') === key; });
            if (index !== -1)
                hook.storeModules.splice(index, 1);
            origUnregister(path);
        };
    }
    hook.flushStoreModules = function () {
        store.replaceState = origReplaceState;
        if (store.registerModule) {
            store.registerModule = origRegister;
            store.unregisterModule = origUnregister;
        }
        return hook.storeModules || [];
    };
};
var traceParser = function (input) {
    var parse = {
        main: {},
        sub: []
    };
    var context1 = input.split("\r").join("");
    context1 = context1.split('Error: ');
    var head = context1[0].split("\n");
    var context2 = head[0].split(':');
    var lineNumber = context2.pop();
    var fileName = context2.join(':');
    var lineText = head[1];
    var context3 = context1[1].split("\n");
    var text = context3.shift();
    context3 = context3.join("\n").split("at ");
    // Add Main Error Stack
    parse.main = {
        text: text,
        fileName: fileName,
        lineNumber: lineNumber,
        lineText: lineText
    };
    for (var _i = 0, context3_1 = context3; _i < context3_1.length; _i++) {
        var subContext = context3_1[_i];
        var context4 = subContext.split(" (");
        var functionName = context4.shift();
        var typeName = "";
        var methodName = "";
        var context6 = functionName.split('.');
        if (context6.length == 1) {
            methodName = context6[0];
        }
        else {
            methodName = context6.pop();
            typeName = context6.join('.');
        }
        var context5 = context4.join('').split(")");
        context5.pop();
        context5 = context5.join(")").split(':');
        var columnNumber = context5.pop();
        var lineNumber_1 = context5.pop();
        var fileName_1 = context5.join(':');
        if (fileName_1.length != 0) {
            // Add Sub Error Stack
            parse.sub.push({
                functionName: functionName,
                typeName: typeName,
                methodName: methodName,
                columnNumber: columnNumber,
                lineNumber: lineNumber_1,
                fileName: fileName_1
            });
        }
        else {
            if (subContext.split(' ').join('').length != 0)
                parse.main.text += subContext;
        }
    }
    return parse;
};
