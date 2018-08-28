window.onload = function() {
    document.getElementById('testUl').onclick = function(event) {
        console.log('===========================');
        console.log(event.target.innerHTML, event.target.innerText);
        console.log('===========================');
    };
};
