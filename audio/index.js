window.onload = function() {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var buffer = null;
    var offAudioCtx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 2, 44100);
    

    // 通过文件获取音频数据
    function getAudioByFile(id) {
        // 通过element audio源获取数据  开始
        document.getElementById(id).onchange = function(value) {
            var files = value.target.files;
            const fr = new FileReader();
            fr.onload = function(event) {
                // 文件里的文本会在这里被打印出来
                console.log(event.target.result);
                offAudioCtx.decodeAudioData(event.target.result).then(res=>{
                    playFun(res);
                });
            };
            fr.readAsArrayBuffer(files[0]);
        };
        // 结束 通过element audio源获取数据
    }
    getAudioByFile('audio');
    // 通过xhr请求获取音频数据
    // https://wavesurfer-js.org/example/split-channels/stereo.mp3
    function getAudioByXHR(url) {
        // 通过ajax请求获取数据 开始
        var ajaxRequest = new XMLHttpRequest();
        ajaxRequest.open('GET', url, true);

        ajaxRequest.responseType = 'arraybuffer';

        ajaxRequest.onload = function() {
            var audioData = ajaxRequest.response;
            offAudioCtx.decodeAudioData(
                audioData,
                function(buffer) {
                    playFun(buffer);
                },
                function(e) {
                    console.log('Error with decoding audio data' + e.err);
                }
            );
        };

        ajaxRequest.send();
        // 结束 通过ajax请求获取数据
    }
    
    document.getElementById('byxhr').onclick = function(){
        getAudioByXHR('https://wavesurfer-js.org/example/split-channels/stereo.mp3');
    }

    function playFun(data) {
        buffer = data;
        requestAnimationFrame(fn);
    }

    (arr = new Float32Array()),
        (arrAll = new Uint8Array()),
        (requestAnimationFrame =
            window.requestAnimationFrame || window.webkitrequestAnimationFrame || window.mozrequestAnimationFrame); //兼容

    function fn() { 
        
        const channels = buffer.numberOfChannels || 2;
        const arr = new Float32Array(buffer.getChannelData(0).length);
        console.log('===========================');
        console.log(arr);
        console.log('===========================');
        for( let j = 0 ; j < buffer.getChannelData(0).length;j++ ){
            let sum = 0.5;
            // for (let i = 0; i < channels; i++) {
            //     // sum  = parseFloat(sum + buffer.getChannelData(i)[j]);
            // }
            // arr[j] = sum;
        }
        
        draw(arr); // 频域数据作为参数传入绘制函数draw
        // playAudio();
    }

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    draw.type = 'column'; //默认显示效果类型
    var height = canvas.height,
        width = canvas.width,
        size = 128; //定义的音频数组长度;
    var line; //渐变色变量

    let totalLines = 0;
    function draw(arr) {
        canvas.width = 2000;
        ctx.clearRect(0, 0, width, height); //每次绘制时，清空上次画布内容
        for (var i = 0; i < arr.length; i = i + 220) {
            totalLines++;
            // var o = Dots[i];
            var rectHeight = arr[i] * height * 0.8;
            ctx.fillStyle = line;
            if (rectHeight > 0) {
                ctx.fillRect(totalLines * 0.5, height / 2 - rectHeight, 0.5, rectHeight);
            } else {
                ctx.fillRect(totalLines * 0.5, height / 2, 0.5, -rectHeight);
            }
        }
    }

    function clearRect() {
        ctx.clearRect(0, 0, width, height);
    }
    const playAudioDom = document.getElementById('playAudio');
    const playAudioHalf = document.getElementById('playAudioHalf');
    const drawDom = document.getElementById('drawAgain');
    playAudioHalf.onclick = function() {
        cPlayAudio(2.0, 4.0);
    };
    playAudioDom.onclick = function() {
        cPlayAudio();
    };

    drawDom.onclick = function() {
        totalLines = 0;
        draw();
    };

    /* start 播放声音公共方法 */

    var cAudioCtx = null;
    var csource = null;
    function cPlayAudio(c, d) {
        if (cAudioCtx) {
            csource.disconnect(cAudioCtx.destination);
            cAudioCtx = null;
            csource = null;
            return;
        }
        cAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        csource = cAudioCtx.createBufferSource();
        csource.buffer = buffer;
        csource.connect(cAudioCtx.destination);
        csource.start(0, c, d);
        csource.onended = function() {
            csource.disconnect(cAudioCtx.destination);
            cAudioCtx = null;
            csource = null;
        };
    }
    /* 播放声音公共方法 end */

    var audioCtx = null;
    var line = document.getElementById('line');
    var myScriptProcessor = null;
    var source = null;
    function playAudio(c, d) {
        if (audioCtx) {
            // 暂停操作
            line.style.left = 0;
            source.disconnect(myScriptProcessor);
            myScriptProcessor.disconnect(audioCtx.destination);
            audioCtx = null;
            return;
        }
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        myScriptProcessor = audioCtx.createScriptProcessor(1024, 1, 1);

        source = audioCtx.createBufferSource();
        // var an = audioCtx.createAnalyser();
        source.loop = true;
        source.buffer = buffer;
        source.connect(myScriptProcessor);
        myScriptProcessor.connect(audioCtx.destination);
        source.start(0, c, d);
        const totalTime = buffer.duration;
        myScriptProcessor.onaudioprocess = function(audioProcessingEvent) {
            var inputBuffer = audioProcessingEvent.inputBuffer;

            // The output buffer contains the samples that will be modified and played
            var outputBuffer = audioProcessingEvent.outputBuffer;

            // Loop through the output channels (in this case there is only one)
            for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
                var inputData = inputBuffer.getChannelData(channel);
                var outputData = outputBuffer.getChannelData(channel);

                // Loop through the 4096 samples
                for (var sample = 0; sample < inputBuffer.length; sample++) {
                    // make output equal to the same as the input
                    outputData[sample] = inputData[sample];
                    // line.style.left = sample * 10 +'px';
                }
            }
            const currentTime = audioCtx.currentTime;
            const left = Math.round((totalLines * currentTime * 10) / (totalTime * 10));
            line.style.left = Math.round(left) * 0.5 + 'px';
            if (currentTime > totalTime) {
                // source.end();
                line.style.left = 0;
                source.disconnect(myScriptProcessor);
                myScriptProcessor.disconnect(audioCtx.destination);
                audioCtx = null;
            }
        };
        // source.start();
    }
};
