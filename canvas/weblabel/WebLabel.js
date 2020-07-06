import BaseEvent from './BaseEvent';

class WebLabel extends BaseEvent {
  constructor(props) {
    super();
    this.scale = 1; //放大 缩小倍数
    this.strokeColor = strokeColor || 'blue'; // 描边颜色
    this.fillColor = fillColor || 'rgba(255,255,255,0.2)'; // 填充颜色
    // TODO:后续考虑做成 proxy形式
    // this.initModels(props);
    const { wrapId, imgLayer } = props || {};
    const $wrap = document.getElementById(wrapId);
    if ($wrap) {
      //  make $wrap style posioton relative
      const wrapPosition = $wrap.style.position;
      $wrap.style.position = wrapPosition == 'relative' ? wrapPosition : 'relative';
      // create a div to wrap
      const $wrapDiv = document.createElement('div');
      $wrapDiv.style = {
        position: 'absolute',
        top: 0,
        left: 0,
      };
      if (imgLayer) {
        $wrapDiv.appendChild(imgLayer);
      }
      const $canvas = document.createElement('canvas');
      $canvas.style = {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zoom: imgLayer && imgLayer.zoom + 1,
      };
      $wrapDiv.appendChild($canvas);
      $wrap.appendChild($wrapDiv);
    } else {
      console.warn('this is need a id to appent the canvas');
    }
  }
  /**
   * 初始化参数
   * @param {*} props
   */
  initModels(props) {
    const { regionFields, drawFields, baseFields } = props || {};
    const { strokeColor, fillColor } = regionFields || {};
    // TODO: 后续增加根据数据类型 点 回显框
  }

  initCanvas($wrap) {}
}

export default WebLabel;
