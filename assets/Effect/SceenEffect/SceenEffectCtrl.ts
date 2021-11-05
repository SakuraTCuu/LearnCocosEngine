const { ccclass, property } = cc._decorator;

@ccclass
export default class SceenEffectCtrl extends cc.Component {

  @property(cc.Sprite)
  TargetSprite: cc.Sprite = null;

  @property(cc.Sprite)
  TestSprite: cc.Sprite = null;

  @property(cc.Camera)
  Camera: cc.Camera = null;

  @property(cc.Label)
  TestLabel: cc.Label = null;

  _renderTexture: cc.RenderTexture = null;

  _spriteFrame: cc.SpriteFrame = null;

  onLoad() {

  }

  start() {
    this.showEffect();

    let time = 10;
    this.schedule(() => {
      this.TestLabel.string = "重生时间: " + time;
      if (time === 0) {
        this.hideEffect();
      }
      time--;
    }, 1, 10, 1);
  }

  showEffect() {
    this.Camera.enabled = true;
    const size = cc.view.getCanvasSize();
    this._renderTexture = new cc.RenderTexture();
    this._renderTexture.initWithSize(size.width, size.height);
    this.Camera.targetTexture = this._renderTexture;

    this._spriteFrame = new cc.SpriteFrame(this._renderTexture);
    this._spriteFrame.setFlipY(true);
    this.TestSprite.node.active = true;
    this.TestSprite.spriteFrame = this._spriteFrame;
  }

  hideEffect() {
    this.TestLabel.node.active = false;
    this.TestSprite.node.active = false;
    this.Camera.targetTexture = null;
    this.Camera.node.active = false;
    // this.Camera.enabled = false;
  }

  update() {
    // this.Camera.
  }


  getDataUrl(data: Uint8Array) {
    let tex = new cc.Texture2D();
    tex.initWithData(data, cc.Texture2D.PixelFormat.RGBA8888, 1334, 750);

    let node = new cc.Node();
    node.addComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
    node.parent = this.node;
    node.scale = 0.5;
  }

  captureRenderTextureBase64New() {
    let time = Date.now();
    //执行渲染的node
    let nodeCamera = new cc.Node();
    nodeCamera.parent = cc.find("Canvas");
    let camera = nodeCamera.addComponent(cc.Camera);

    let width = 1334;
    let height = 750;

    camera.alignWithScreen = false;
    camera.ortho = true;
    camera.orthoSize = height / 2;

    /**渲染的内容 */
    let texture = new cc.RenderTexture();
    texture.initWithSize(width, height, (cc as any).gfx.RB_FMT_S8);

    camera.targetTexture = texture;
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    let ctx = canvas.getContext('2d');
    camera.render();
    let data = texture.readPixels();

    let rowBytes = width * 4;
    // 依次读取图片里的每行数据，放入到ctx中。
    for (let row = 0; row < height; row++) {
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // DEMO 写法（高性能，兼容性好） 比上边的快200ms左右
      // 参考于 https://forum.cocos.org/t/cocoscreator/72580/17
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      let srow = height - 1 - row;
      // 从图片的所有数据中，获取一行的图片字节数据
      let oneLineImageData = new Uint8ClampedArray(data.buffer, Math.floor(srow * width * 4), rowBytes);
      // 设置图片数据对象
      // 设置一个一行的图片，所以就是 width, 1
      let imageData = new ImageData(oneLineImageData, width, 1);
      ctx.putImageData(imageData, 0, row);
    }

    let dataURL = canvas.toDataURL("image/png");
    console.log(dataURL);
    nodeCamera.destroy();
    texture.destroy();
    return dataURL;
  }
}
