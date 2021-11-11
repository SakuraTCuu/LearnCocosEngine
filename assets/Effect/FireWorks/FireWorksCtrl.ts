const { ccclass, property } = cc._decorator;

@ccclass
export default class FireWorksCtrl extends cc.Component {

    @property(cc.Camera)
    MiniCamera: cc.Camera = null;

    @property(cc.Node)
    MiniNode: cc.Node = null;

    @property(cc.Node)
    TouchNode: cc.Node = null;

    @property(cc.Prefab)
    DotPrefab: cc.Prefab = null;

    @property(cc.Sprite)
    MainSprite: cc.Sprite = null;

    @property(cc.Sprite)
    TargetSprite: cc.Sprite = null;

    private mDots: Array<Dot> = [];
    private mFlowers: Array<Flower> = [];

    private renderTextureArray: Array<cc.RenderTexture> = [];
    private spfList: Array<cc.SpriteFrame> = [];

    onLoad() {
        this.TouchNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);

        let width = cc.winSize.width;
        let height = cc.winSize.height;
        width = 750;
        height = 1440;
        let rtx1 = new cc.RenderTexture();
        let rtx2 = new cc.RenderTexture();
        rtx1.initWithSize(width, height);
        rtx2.initWithSize(width, height);

        this.spfList.push(new cc.SpriteFrame(rtx1));
        this.spfList.push(new cc.SpriteFrame(rtx2));

        this.renderTextureArray.push(rtx1);
        this.renderTextureArray.push(rtx2);
    }

    onTouchEnd(event: cc.Event.EventTouch) {
        console.log("onTouchEnd");
        //创建一个烟花点
        const p = this.TouchNode.convertToNodeSpaceAR(event.getLocation());
        const dots: Array<cc.Node> = [];
        for (let i: number = 0; i < 200; i++) {
            const dot = cc.instantiate(this.DotPrefab);
            this.MiniNode.addChild(dot);
            dot.y = -10000;
            dots[i] = dot;
        }
        this.mDots.push(new Dot(dots, p.x, p.y, 200 + Math.random() * 200));
    }

    count: number = 0;
    update() {

        this.count++;

        let i: number = this.mDots.length;
        while (i--) {
            const dot = this.mDots[i];
            if (dot.step()) {
                this.mDots.splice(i, 1);
                this.mFlowers.push(new Flower(dot.mDotList));
                dot.clear();
            }
        }

        let index = this.count % 2;
        this.MiniCamera.targetTexture = this.renderTextureArray[index];
        this.MainSprite.spriteFrame = this.spfList[index];
        this.TargetSprite.spriteFrame = this.spfList[this.spfList.length - 1 - index];
    }
}

const COLORS = [
    // new cc.Color(255, 255, 255),
    new cc.Color(255, 100, 0),
    new cc.Color(0, 255, 100),
    new cc.Color(100, 0, 255),
    new cc.Color(255, 255, 100),
    new cc.Color(255, 100, 255),
    new cc.Color(100, 255, 255)
];

const g = -0.2;

class Dot {

    mDotList: Array<cc.Node> = null;
    x: number = 0;
    y: number = 0;
    targetY: number = 0;

    constructor(dotList: Array<cc.Node>, x: number, y: number, targetY: number) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];

        this.mDotList = dotList;
        this.x = x;
        this.y = y;
        this.targetY = targetY;

        for (const dot of this.mDotList) {
            if (Math.random() < 0.99) {
                dot.color = color;
            } else {
                dot["blink"] = true;
            }
        }
    }

    step() {
        this.y += 10;
        for (const dot of this.mDotList) {
            const rad = Math.PI * 2 * Math.random();
            dot.x = this.x + Math.random() * 10 * Math.cos(rad);
            dot.y = this.y + Math.random() * 10 * Math.sin(rad);
        }
        return this.y >= this.targetY;
    }

    clear() {
        this.mDotList = null;
    }
}

class Flower {

    constructor(dotList: Array<cc.Node>) {

    }
}