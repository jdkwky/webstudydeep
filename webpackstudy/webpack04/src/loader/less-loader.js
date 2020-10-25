const less = require('less');

function loader(source) {
    let css = '';
    less.render(source, function(err, output) {
        css = output.css;
    });
    css = css.replace(/\n/g, '\\n');
    return css;
    // return source;
}

module.exports = loader;
