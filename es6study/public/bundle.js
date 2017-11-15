/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

eval("window.onload = function() {\r\n    var list = ['start', '20', 'abc', 'def'];\r\n    for (var l of list) {\r\n        \r\n        if (l == 20) {\r\n            continue;\r\n        }\r\n\r\n        if (l == 'abc') {\r\n            break;\r\n        }\r\n        console.log(l);\r\n    }\r\n    var map=new Map();\r\n    map.set('name','sc');\r\n    map.set('age',18);\r\n    for([key,value] of map){\r\n    \tconsole.log(key,value);\r\n    }\r\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9uZXdGZWF0dXJlb2ZFczYuanM/OTRkZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsid2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGxpc3QgPSBbJ3N0YXJ0JywgJzIwJywgJ2FiYycsICdkZWYnXTtcclxuICAgIGZvciAodmFyIGwgb2YgbGlzdCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChsID09IDIwKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGwgPT0gJ2FiYycpIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGwpO1xyXG4gICAgfVxyXG4gICAgdmFyIG1hcD1uZXcgTWFwKCk7XHJcbiAgICBtYXAuc2V0KCduYW1lJywnc2MnKTtcclxuICAgIG1hcC5zZXQoJ2FnZScsMTgpO1xyXG4gICAgZm9yKFtrZXksdmFsdWVdIG9mIG1hcCl7XHJcbiAgICBcdGNvbnNvbGUubG9nKGtleSx2YWx1ZSk7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL25ld0ZlYXR1cmVvZkVzNi5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n");

/***/ })
/******/ ]);