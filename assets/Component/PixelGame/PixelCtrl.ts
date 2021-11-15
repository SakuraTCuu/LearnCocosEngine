import ButtonItemCtrl from "./ButtonItemCtrl";

const { ccclass, property } = cc._decorator;

interface ActionType {
    interval: number;
    loop: boolean
}
const ACT = {
    attack: {
        interval: 0.071,
        loop: false,
    },
    dash: {
        interval: 0.071,
        loop: false,
    },
    death: {
        interval: 0.071,
        loop: false,
    },
    idle: {
        interval: 0.071,
        loop: false,
    },
    parry: {
        interval: 0.071,
        loop: false,
    },
    parry_failed: {
        interval: 0.071,
        loop: false,
    },
    review: {
        interval: 0.071,
        loop: false,
    },
    run: {
        interval: 0.071,
        loop: false,
    }
}

@ccclass
export default class pixelCtrl extends cc.Component {

    @property(cc.Sprite)
    TestSprite: cc.Sprite = null;

    @property({
        type: cc.Sprite,
        displayName: "图片挂载点"
    })
    MountSprite: cc.Sprite = null;

    @property(cc.Prefab)
    ButtonPrefab: cc.Prefab = null;

    @property(cc.Node)
    ContentNode: cc.Node = null;

    private mIsPlaying: boolean = false;
    private mCallBack: Function = null;
    private FrameSprites: cc.SpriteFrame[] = [];
    private mActionConfig: ActionType = null;
    private mIndex: number = -1;

    onLoad() {

        this.loadAsset(Object.keys(ACT)[0]);
        this.mActionConfig = Object.values(ACT)[0];

        this.playAction();
        this.initEvent();
        this.initView();
    }

    initEvent() {
        this.node.on("click_act", this.onClickAct, this);
    }

    /**切换动作 */
    onClickAct(event: cc.Event.EventCustom) {
        this.mIndex = -1;
        let actName = event.detail;
        console.log(actName);
        this.mActionConfig = ACT[actName];
        this.loadAsset(actName);
    }

    initView() {
        for (const key in ACT) {
            if (Object.prototype.hasOwnProperty.call(ACT, key)) {
                this.createButton(key);
            }
        }
    }

    createButton(info: string) {
        let item = cc.instantiate(this.ButtonPrefab);
        let itemCtrl = item.getComponent(ButtonItemCtrl);
        itemCtrl.init(info);
        item.parent = this.ContentNode;
    }

    loadAsset(act: string) {
        cc.resources.loadDir(`pixel/${act}`, cc.SpriteFrame, (err, res: cc.SpriteFrame[]) => {
            this.FrameSprites = res;
        })
    }

    /**
    * @title 播放动画（循环切换图片）
    */
    playAction() {
        let isLoop = this.mActionConfig.loop;
        isLoop = true;
        let interval = this.mActionConfig.interval;
        this.mCallBack = () => {
            if (!isLoop && this.mIndex >= this.FrameSprites.length) {
                return;
            }
            this.mIndex++;
            this.MountSprite.spriteFrame = this.FrameSprites[this.mIndex % this.FrameSprites.length];
        };
        this.mIsPlaying = true;

        this.schedule(this.mCallBack, interval);

    }

    /**
     * @title 停止动画
     */
    stopAction() {
        this.mIsPlaying = false;
        this.unschedule(this.mCallBack);
        this.MountSprite.spriteFrame = this.FrameSprites[this.FrameSprites.length - 1];
    }
}
