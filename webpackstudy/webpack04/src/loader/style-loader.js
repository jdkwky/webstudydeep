function loader(source) {
    let style = `
        let style = document.createElement('style');
        style.innerHTML =  ${JSON.stringify(source)};
        document.head.appendChild(style);
    `;
    return style;
    // return source;
}

module.exports = loader;
