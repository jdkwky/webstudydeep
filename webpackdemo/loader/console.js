module.exports = function(content,map,meta){
    console.log('=========================');
    
    console.log(content,'-----',meta,'-----',map);
    console.log('=========================');
    
    return `${content};console.log('loder exec')`
}