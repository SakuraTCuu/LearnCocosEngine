const { ccclass, property } = cc._decorator;

const texWid = 640;
const texHei = 1440;

cc.macro.CLEANUP_IMAGE_CACHE = true;
cc.dynamicAtlasManager.enabled = false;

@ccclass
export default class Main extends cc.Component {

    @property(cc.Prefab)
    private dot_prefab: cc.Prefab = null;

    private renTexs: Array<cc.RenderTexture>;//两张轮替，规避 [.WebGL-0000013200214F00] GL_INVALID_OPERATION: Feedback loop formed between Framebuffer and active Texture.
    private sfs: Array<cc.SpriteFrame>;
    private renTexIndex: number;

    private sp: cc.Sprite;
    private midCamera: cc.Camera;
    private mid: cc.Node;
    private mid_sp: cc.Sprite;

    private dots: Array<Dot>;
    private flowers: Array<Flower>;

    private renderTextureArray: Array<cc.RenderTexture> = [];
    private spfList: Array<cc.SpriteFrame> = [];

    protected onLoad(): void {

        // this.renTexs = [new cc.RenderTexture(), new cc.RenderTexture()];
        // this.renTexs[0].initWithSize(texWid, texHei);
        // this.renTexs[1].initWithSize(texWid, texHei);
        // this.sfs = [new cc.SpriteFrame(this.renTexs[0]), new cc.SpriteFrame(this.renTexs[1])];
        // this.renTexIndex = -1;

        // this.renderTextureArray = [new cc.RenderTexture(), new cc.RenderTexture()];
        // this.renderTextureArray[0].initWithSize(texWid, texHei);
        // this.renderTextureArray[1].initWithSize(texWid, texHei);
        // this.spfList = [new cc.SpriteFrame(this.renderTextureArray[0]), new cc.SpriteFrame(this.renderTextureArray[1])];
        // this.renTexIndex = -1;

        let width = cc.winSize.width;
        let height = cc.winSize.height;
        console.log(width, height)
        let rtx1 = new cc.RenderTexture();
        let rtx2 = new cc.RenderTexture();
        // rtx1.initWithSize(texWid, texHei);
        // rtx2.initWithSize(texWid, texHei);
        rtx1.initWithSize(width, height);
        rtx2.initWithSize(width, height);

        this.spfList.push(new cc.SpriteFrame(rtx1));
        this.spfList.push(new cc.SpriteFrame(rtx2));

        this.renderTextureArray.push(rtx1);
        this.renderTextureArray.push(rtx2);

        this.sp = this.node.getChildByName("sp").getComponent(cc.Sprite);
        this.midCamera = this.node.getChildByName("midCamera").getComponent(cc.Camera);
        this.mid = this.midCamera.node.getChildByName("mid");
        this.mid_sp = this.mid.getChildByName("sp").getComponent(cc.Sprite);

        // const rect = this.mid.getChildByName("rect");
        // let oldP: cc.Vec2;
        // rect.on(cc.Node.EventType.TOUCH_START, (evt: cc.Event.EventTouch) => {
        //     oldP = evt.getLocation();
        // });
        // rect.on(cc.Node.EventType.TOUCH_MOVE, (evt: cc.Event.EventTouch) => {
        //     const p = evt.getLocation();
        //     rect.x += p.x - oldP.x;
        //     rect.y += p.y - oldP.y;
        //     oldP = p;
        // });

        this.dots = [];
        this.flowers = [];

        this.sp.node.on(cc.Node.EventType.TOUCH_START, (evt: cc.Event.EventTouch) => {
            const p = this.node.convertToNodeSpaceAR(evt.getLocation());
            const dots: Array<cc.Node> = [];
            for (let i: number = 0; i < 200; i++) {
                const dot = cc.instantiate(this.dot_prefab);
                this.mid.addChild(dot);
                dot.y = -10000;
                dots[i] = dot;
            }
            this.dots.push(new Dot(dots, p.x, p.y, 200 + Math.random() * 200));
        });

    }

    count: number = 0;
    protected update(): void {
        this.count++;
        let i: number = this.dots.length;
        while (i--) {
            const dot = this.dots[i];
            if (dot.step()) {
                this.dots.splice(i, 1);
                this.flowers.push(new Flower(dot.dots));
                dot.clear();
            }
        }

        // i = this.flowers.length;
        // while (i--) {
        //     const flower = this.flowers[i];
        //     if (flower.step()) {
        //         this.flowers.splice(i, 1);
        //         flower.clear();
        //     }
        // }

        let index = this.count % 2;
        this.midCamera.targetTexture = this.renderTextureArray[index];
        this.sp.spriteFrame = this.spfList[index];
        this.mid_sp.spriteFrame = this.spfList[this.spfList.length - 1 - index];

        // if (++this.renTexIndex >= this.renTexs.length) {
        //     this.renTexIndex = 0;
        // }
        // this.midCamera.targetTexture = this.renTexs[this.renTexIndex];
        // this.sp.spriteFrame = this.sfs[this.renTexIndex];
        // this.mid_sp.spriteFrame = this.sfs[this.renTexs.length - 1 - this.renTexIndex];
    }
}

const colors = [
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

    public dots: Array<cc.Node>;
    public x: number;
    public y: number;
    private 爆点: number;
    public constructor(dots: Array<cc.Node>, x: number, y: number, 爆点: number) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        //color.fromHEX(Math.floor(Math.random() * 0x1000000).toString(16));
        this.dots = dots;
        for (const dot of this.dots) {
            if (Math.random() < 0.99) {
                dot.color = color;
            } else {
                dot["闪"] = true;
            }
        }
        this.x = x;
        this.y = y;
        this.爆点 = 爆点;
    }

    public step(): boolean {
        this.y += 10;
        for (const dot of this.dots) {
            const rad = Math.PI * 2 * Math.random();
            dot.x = this.x + Math.random() * 10 * Math.cos(rad);
            dot.y = this.y + Math.random() * 10 * Math.sin(rad);
        }
        return this.y >= this.爆点;
    }

    public clear(): void {
        this.dots = null;
    }

}

class Flower {

    private dots: Array<cc.Node>;
    private count: number;
    public constructor(dots: Array<cc.Node>) {
        this.dots = dots;
        for (const dot of this.dots) {
            const rad = Math.PI * 2 * Math.random();
            dot["vx"] = Math.random() * 10 * Math.cos(rad);
            dot["vy"] = 5 + Math.random() * 10 * Math.sin(rad);
        }
        this.count = 0;
    }

    public step(): boolean {
        for (const dot of this.dots) {
            dot["vy"] += g;
            dot["vx"] *= 1;
            dot["vy"] *= 1;
            dot.x += dot["vx"];
            dot.y += dot["vy"];
            if (dot["闪"]) {
                dot.active = Math.random() < 0.5;
            } else {
                // dot.opacity *= 0.995;
            }
        }
        return ++this.count >= 200;
    }

    public clear(): void {
        for (const dot of this.dots) {
            dot.destroy();
        }
        this.dots.length = 0;
        this.dots = null;
    }

}