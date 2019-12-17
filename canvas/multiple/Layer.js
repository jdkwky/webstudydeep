import BaseObject from './BaseObject.js';
class Layer extends BaseObject {
    constructor(params) {
        super(params);
        this.features = [];
    }

}