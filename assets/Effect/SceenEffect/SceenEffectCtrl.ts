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

}
