function createElement(type, props, ...children){
    return {
        type,
        props:{
            ...props,
            children: children.map(child =>typeof child ==='object' ? child : createTextElement(child))
        }
    }
}


function createTextElement(text){
    return {
        type: 'TEXT_ELEMENT',
        props:{
            nodeValue: text,
            children: []
        }
    }
}




let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;
let deletions = null;

function commitRoot(){
    //  add nodes to dom
    deletions.forEach(commitWork)
    commitWork(wipRoot.child);

    currentRoot = wipRoot;

    wipRoot = null;
}

function commitWork(fiber){
    if(!fiber){
        return
    }

    const domParent = fiber.parent.dom;
    if (
        fiber.effectTag === "PLACEMENT" &&
        fiber.dom != null
    ) {
        domParent.appendChild(fiber.dom)
    }else if (
        fiber.effectTag === "UPDATE" &&
        fiber.dom != null
    ) {
        updateDom(
          fiber.dom,
          fiber.alternate.props,
          fiber.props
        )
    }else if (fiber.effectTag === "DELETION") {
        domParent.removeChild(fiber.dom)
    }
    ​

    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

function workLoop(deadline){
    let shouldYield = false;
    while( nextUnitOfWork && !shouldYield ){
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

        shouldYield = deadline.timeRemaining() < 1
    }

    if(!nextUnitOfWork && wipRoot){
        commitRoot();
    }

    requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber){
    if(!fiber.dom){
        filber.dom = createDom(fiber);
    }
    // if(fiber.parent){
    //     fiber.parent.dom.appendChild(fiber.dom);
    // }

    const elements = fiber.props.children;
    reconcileChildren(fiber, elements);

    if(fiber.child){
        return fiber.child;
    }
    let nextFiber = fiber;
    while(nextFiber){
        if(nextFiber.sibling){
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent;
    }
}


function reconcileChildren(fiber, elements){
    let index = 0 ;
    let oldFiber =
        wipFiber.alternate && wipFiber.alternate.child
    let prevSibling = null;
    while(index < elements.length || oldFiber != null){
        const element = elements[index];
        let newFiber = null;

        const sameType =
            oldFiber &&
            element &&
            element.type == oldFiber.type;
        ​
        if (sameType) {
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom: oldFiber.dom,
                parent: wipFiber,
                alternate: oldFiber,
                effectTag: "UPDATE",
            }
        }

        if (element && !sameType) {
            newFiber = {
              type: element.type,
              props: element.props,
              dom: null,
              parent: wipFiber,
              alternate: null,
              effectTag: "PLACEMENT",
            }
        }

        if (oldFiber && !sameType) {
            oldFiber.effectTag = "DELETION"
            deletions.push(oldFiber)
          }

        // const newFiber = {
        //     type: element.type,
        //     props: element.props,
        //     parent: fiber,
        //     dom: null
        // }
        if(index === 0){
            fiber.child = newFiber;
        }else{
            prevSibling.sibling = newFiber;
        }

        prevSibling = newFiber;
        index++;
    }
}
const isEvent = key => key.startsWith("on")
const isProperty = key =>
  key !== "children" && !isEvent(key)
const isNew = (prev, next) => key =>
  prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)

function updateDom(dom, prevProps, nextProps) {
    // remove events
    Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.removeEventListener(
        eventType,
        prevProps[name]
      )
    })

     // Add event listeners
  Object.keys(nextProps)
  .filter(isEvent)
  .filter(isNew(prevProps, nextProps))
  .forEach(name => {
    const eventType = name
      .toLowerCase()
      .substring(2)
    dom.addEventListener(
      eventType,
      nextProps[name]
    )
  })
  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ""
    })
​
  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })
}

function createDom(filber){
    const dom = element.type =='TEXT_ELEMENT' ? document.createTextNode('') :document.createElement(element.type);
    container.appendChild(dom);

    Object.keys(element.props).filter(isProperty).forEach(name =>{
        dom[name] = element.props[name]
    })
    return dom;
}

function render (element, container){

    wipRoot = {
        dom: container,
        props: {
            children: [element]
        },
        alternate: currentRoot
    }
    deletions = []
    nextUnitOfWork = wipRoot;

    // element.props.children.forEach(child => {
    //     render(child,dom);
    // });
}





const Didact = {
    createElement,
    render
}




const element = Didact.createElement(
    'div',
    {
        id: 'foo'
    },
    Didact.createElement('a', { style:"color:red" }, 'bar'),
    Didact.createElement('b')
)


Didact.render(element, document.getElementById('root'))

/**
 * @jsx Didact.createElement
 */
// const element = (
//     <div id="foo">
//         <a>bar</a>
//         <b/>
//     </div>
// )