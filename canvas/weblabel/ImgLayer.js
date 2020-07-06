import BaseEvent from './BaseEvent';

class ImgLayer extends BaseEvent {
  constructor(props) {
    super();
    const $imgLayer = this.initImgLayer(props);
    return $imgLayer;
  }

  initImgLayer(props) {
    const { url } = props || {};
    if (url) {
      const $imageDom = document.createElement('img');
      $imageDom.src = url;
      $imageDom.onload = () => {
        console.log('image success');
      };
      $imageDom.onerror = () => {
        console.log('image error');
      };
      return $imageDom;
    } else {
      console.warn('please input image url');
    }
  }
}

export default ImgLayer;
