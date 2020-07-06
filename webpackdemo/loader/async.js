const path = require('path');
const fs = require('fs');

module.exports = function(content,map,meta){
    var callback = this.async();
    var  headerPath = path.resolve('app','asyncLoader.js');
    this.addDependency(headerPath);

    fs.readFile(headerPath,'utf-8',function(err,header){
        if(err) return callback(err);
        callback(null,header +'\n'+content)
    })
}