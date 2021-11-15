import ButtonItemCtrl from "./ButtonItemCtrl";
import FrameCtrl from "./FrameCtrl";

const { ccclass, property } = cc._decorator;

interface ActionType {
    interval: number;
    loop: boolean
}
const ACT = {
    attack: {
        interval: 0.071,
        loop: true,
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
        loop: true,
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
        loop: true,
    }
}

@ccclass
export default class PixelCtrl extends cc.Component {

    @property(cc.Prefab)
    ButtonPrefab: cc.Prefab = null;

    @property(cc.Node)
    ContentNode: cc.Node = null;

    @property(FrameCtrl)
    FrameCtrl: FrameCtrl = null;

    private mActionConfig: ActionType = null;
    private mFrameSprites: cc.SpriteFrame[] = [];

    onLoad() {

        this.loadAsset(Object.keys(ACT)[0]);
        this.mActionConfig = Object.values(ACT)[0];

        this.initEvent();
        this.initView();
    }

    initEvent() {
        this.node.on("click_act", this.onClickAct, this);
    }

    /**切换动作 */
    onClickAct(event: cc.Event.EventCustom) {
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
            this.mFrameSprites = res;
            this.playAction();
        })
    }

    playAction() {
        this.FrameCtrl.playAction(this.mFrameSprites, this.mActionConfig.interval, this.mActionConfig.loop);
    }
}
