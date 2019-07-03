class Sington{
    constructor(name){
        this.name = name;
    }
}

class GetSington{
    constructor(name){
        this._sington = new Sington(this.name);
    }
    get sington(){
        return this._sington;
    }

}


const sington = new GetSington('wky');
const s1 =sington.sington;
const s2 = sington.sington;
const s3 = sington.sington;
console.log('===========================');
console.log('sington.sington1',s1);
console.log('===========================');
console.log('===========================');
console.log('sington.sington2',s2);
console.log('===========================');
console.log('===========================');
console.log('sington.sington3',s3);
console.log('===========================');
console.log('===========================');
console.log('s1 === s2 === s3', s1 === s2, s2===s3, s1===s3);
console.log('===========================');