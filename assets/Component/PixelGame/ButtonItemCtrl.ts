const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonItemCtrl extends cc.Component {

    @property(cc.Label)
    TextLab: cc.Label = null;

    private mDes: string = "";

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    init(des: string) {
        this.TextLab.string = des;
        this.mDes = des;
    }

    onTouchEnd() {
        let event = new cc.Event.EventCustom("click_act", true);
        event.detail = this.mDes;
        this.node.dispatchEvent(event);
    }
}
