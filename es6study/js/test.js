window.onload = () => {
    console.log('=========test.js start =====');
    // const { blowUp } = {};
    // const puppies = [];
    // const index = 1;
    // const arrow = () => {
    //     const index = 2;
    //     console.log(this.index, this)
    // }
    // arrow();
    // console.log(this);
    // console.log(window.index);
    // var index = 0;
    // console.log(this.index, window.index);
    var arrowObj={
    	index:190,
    	arrowf:()=>{
    		const index=180;
    		setTimeout(()=>{
    			console.log(this.index);
    		},100);
    	}
    };
    arrowObj.arrowf();
    console.log(typeof Symbol());
    // var chewToys=puppies.map(puppy =>{
    // 	const index=2;
    // 	console.log(this.index);
    // });
    // console.log(chewToys);
    console.log('=========test.js end =======');
}