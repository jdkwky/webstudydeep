class Sington {
    constructor(name) {
        this.name = name;
    }
}

class GetSington {
    constructor(name) {
        this._sington = new Sington(this.name);
    }
    get sington() {
        return this._sington;
    }
    set sington(op) {}
}

const sington = new GetSington('wky');
const s1 = sington.sington;
const s2 = sington.sington;
const s3 = sington.sington;
// console.log('===========================');
// console.log('sington.sington1', s1);
// console.log('===========================');
// console.log('===========================');
// console.log('sington.sington2', s2);
// console.log('===========================');
// console.log('===========================');
// console.log('sington.sington3', s3);
// console.log('===========================');
// console.log('===========================');
// console.log('s1 === s2 === s3', s1 === s2, s2 === s3, s1 === s3);
// console.log('===========================');

// console.log('===========================');
// console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
// console.log('===========================');

const s4 = new GetSington('yc').sington;
// console.log('===========================');
// console.log('sington.sington', s4 === s1);
// console.log('===========================');

/* 写一个单向链数据结构的 js 实现并标注复杂度 */

class Node {
    constructor(value, next) {
        this.value = value;
        this.next = next;
    }
}

class LinkList {
    constructor(value) {
        const node = new Node(value, null);
        this.linkList = node;
        this.currentNode = node;
    }

    _delete(value, node, preNode) {
        const currentValue = node.value;
        const nextNode = node.next;
        if (currentValue === value) {
            if (nextNode) {
                preNode.next = nextNode;
            } else {
                preNode.next = null;
            }
        } else {
            if (node.next) {
                this._delete(value, node.next, node);
            }
        }
    }

    insert(value) {
        // o(1)
        const nextNode = new Node(value, null);
        this.currentNode.next = nextNode;
        this.currentNode = nextNode;
        return this;
    }

    delete(value) {
        // O(n)
        if (this.linkList.next) {
            if (this.linkList.value === value) {
                this.linkList = this.linkList.next;
            } else {
                this._delete(value, this.linkList.next, this.linkList);
            }
        } else {
            if (value === this.linkList.value) {
                this.linkList = new Node(null, null);
            }
        }
        return this;
    }
    _findNode(value, node) {
        if (node.value == value) {
            return node;
        } else {
            const nextNode = node.next;
            if (nextNode) {
                return this._findNode(value, nextNode);
            }
            return null;
        }
    }
    findNode(value) {
        return this._findNode(value, this.linkList);
    }
    getNode() {
        return this.linkList;
    }
}

// test

const linkList = new LinkList(5);
console.log(linkList);

linkList
    .insert(10)
    .insert(11)
    .insert(15)
    .insert(20);

console.log(linkList.getNode());
console.log('===========================');
console.log('linkList.findNode(11)', linkList.findNode(11));
console.log('===========================');
console.log('===========================');
console.log('linkList.deleteNode(11)', linkList.delete(5).getNode());
console.log('===========================');
console.log('===========================');
console.log('linkList.findNode(20)', linkList.findNode(15));
console.log('===========================');
