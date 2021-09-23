const { ccclass, property } = cc._decorator;


cc.macro.ALLOW_IMAGE_BITMAP = false;
cc.macro.CLEANUP_IMAGE_CACHE = true;
cc.macro.ENABLE_TRANSPARENT_CANVAS = true;
cc.macro.ENABLE_WEBGL_ANTIALIAS = true;
cc.macro.ENABLE_MULTI_TOUCH = false;
cc.dynamicAtlasManager.enabled = false;

@ccclass
export default class ShaderArray extends cc.Component {

    @property(cc.Sprite)
    TestSprite: cc.Sprite = null;

    mMaterial: cc.MaterialVariant;
    mWidth: number = 0.1; // 0-1之间
    mHeight: number = 0.1;

    mCount: number = 0;

    mArray: Array<number> = [];

    onLoad() {
        this.mMaterial = this.TestSprite.getMaterial(0);
    }

    start() {
        this.TestSprite.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);

        cc.director.once(cc.Director.EVENT_AFTER_DRAW, () => {
            this.mMaterial.setProperty("size", cc.v2(this.mWidth, this.mHeight))
        })
    }

    onTouchEnd(e: cc.Event.EventTouch) {
        this.mCount++;
        this.mMaterial.setProperty("count", this.mCount);

        let pos = e.getLocation();
        pos = this.TestSprite.node.convertToNodeSpaceAR(pos);
        pos = pos.add(cc.v2(this.TestSprite.node.width / 2, this.TestSprite.node.height / 2));
        let w = this.TestSprite.node.width;
        let h = this.TestSprite.node.height;
        let x = pos.x / w;
        let y = 1 - pos.y / h;
        cc.log(x, y);
        this.mArray.push(x - this.mWidth / 2); //确保以点击的位置为锚点 而不是以左上角
        this.mArray.push(y - this.mHeight / 2);
        this.mArray.push(0);
        this.mArray.push(0);
        this.mMaterial.setProperty('posArr', new Float32Array(this.mArray));
    }
}
