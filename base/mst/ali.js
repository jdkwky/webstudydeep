/**
 * 题目一：
 * 区间用长度为2的数字数组表示，如[2, 5]表示区间2到5（包括2和5）；
 * 区间不限定方向，如[5, 2]等同于[2, 5]；
 * 实现`getIntersection`，可接收多个区间，并返回所有区间的交集（用区间表示），
 * 如空集用null表示
 *
 * 输入：getIntersection([5, 2], [4, 9], [3, 6])
 * 输出：[4, 5]
 *
 * 输入：getIntersection([1, 7], [8, 9])
 * 输出：null
 */
function getIntersection() {
    let args = [];
    if (arguments.length == 0) {
        return null;
    } else if (arguments.length == 1) {
        return arguments[0]
    }


    for (let i = 0, len = arguments.length; i < len; i++) {
        const [a1, a2] = arguments[i];
        if (a1 > a2) {
            arguments[i] = [a2, a1];
        }
        args.push(arguments[i]);
    }

    args = args.sort((a, b) => a[0] - b[0]);


    let result = args[0];
    for (let j = 1, jlen = args.length; j < jlen; j++) {
        const [t1, t2] = args[j];
        const [r1, r2] = result;

        if (t1 === t2) {
            //    点
            if (t1 >= r1 && t2 <= r2) {
                result = [t1, t2]
            } else {
                return null;
            }
        } else {
            // 线段
            if (t1 >= r1 && t1 <= r2 && t2 <= r2) {
                result = [t1, t2];

            } else if (t1 >= r1 && t1 <= r2 && t2 > r2) {
                result = [t1, r2];
            } else {
                return null;
            }
        }
    }
    return result;


}


console.log(getIntersection([5, 2], [4, 9], [3, 6]))
console.log(getIntersection([1, 7], [8, 9]));
console.log(getIntersection([5, 2]));
console.log(getIntersection());
console.log(getIntersection([1, 7], [8, 9]));
console.log(getIntersection([7, 1], [5, 9], [6, 6]));





/**
 * 题目二：
 * 匈牙利命名字符串和驼峰命名字符串互相转换
 * 说明：
 *  1. 将字符串匈牙利命名字符串(例如：person_first_name)转成驼峰命名字符串(例如：personFirstName)
 *  2. 将驼峰命名的字符串(例如：personFirstName)转成匈牙利命名字符串(例如：person_first_name)
 *  3. 字符长度不限
 * 示例：
 *  const str1 = 'person_first_name';
 *  parseStrToCamelCase(str1); // 返回 'personFirstName'
 *
 *  const str2 = 'personFirstName';
 *  parseStrToHungarianNotation(str2); // 返回 'person_first_name'
 */
function parseStrToCamelCase(str) {
    const strList = str.split('_');
    let result = strList[0];
    for (let i = 1, len = strList.length; i < len; i++) {
        const name = strList[i];
        result += name.slice(0, 1).toUpperCase() + name.slice(1);
    }
    return result;
}


console.log(parseStrToCamelCase('person_first_name'));

console.log(parseStrToCamelCase('_person'));



/**
 * 题目三：
 * 对页面上所有 a 标签， 在其被点击时，判断其 href 是否是以 https 开头，
 * 如果是，则不做任何处理；如果不是，则 console.warn 输出 非 https 链接。
 */


 /**
  * 
  * <html>
  * <head></head>
  * <body>
        <div>
        <span>f</span>
        <span>o</span>
        <span>o</span>
        </div>
    </body>
    </html>
    会输出：

    {
    totalElementsCount: 7,
    maxDOMTreeDepth: 4,
    maxChildrenCount: 3
    }
*/



function getDomInfo(){
    let totalElementsSet = new Set();
    totalElementsSet.add('html');
    // var maxDOMTreeDepth = 0;
    const deepList = [];
    const htmlNode = document.querySelector('html');
    function getChildren(node,tag, deep){
        const children = node &&  node.childNodes ||[];
        const childrenList =  Array.prototype.slice.call(children,0);
        if(tag=='body'&& deep){
            deep = deep +1;
        }
        if(childrenList.length > 0){
            console.log(childrenList, 'childrenList', tag)
            childrenList.forEach(child => {
                totalElementsSet.add(node.tagName);
                if(node.tagName==='BODY'){
                    deep = 1;
                    const result = getChildren(child,'body',deep);
                    if(result){
                        deepList.push(result);
                    }
                }else{
                    const result =  getChildren(child, tag, deep);
                    if(result){
                        deepList.push(result);
                    }
                }
            });
        }
        return deep;
    }
    
    getChildren(htmlNode,'');
    // console.log(maxDOMTreeDepth, 'maxDOMTreeDepth');
    const maxDom = deepList.sort((val1, val2)=> val2 - val1)[0];
    return {
        totalElementsCount: totalElementsSet.size,
        maxDOMTreeDepth: maxDom,
        maxChildrenCount:maxDom-1
    }
}

const domResult = getDomInfo();
console.log(domResult,'domResult');