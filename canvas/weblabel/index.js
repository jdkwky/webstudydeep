import WebLabel from './WebLabel';
import ImgLayer from './ImgLayer';

console.log(WebLabel);

const weblabel = new WebLabel({
  wrapId: 'canvasWrap',
  imgLayer: new ImgLayer({
    url:
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599405254580&di=d91c406f9cd8627000924c5365201248&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F54%2F49%2F01300542446111139563495498728.jpg',
  }),
});
