import ButtonItemCtrl from "./ButtonItemCtrl";
import FrameCtrl from "./FrameCtrl";

const { ccclass, property } = cc._decorator;

const enum Direction {
    LEFT = -1,
    RIGHT = 1,
}

@ccclass
export default class GameCtrl extends cc.Component {

    @property(cc.Node)
    Player: cc.Node = null;

    @property
    Speed: number = 1000;

    mMove: boolean = false;
    mDirection: Direction = Direction.RIGHT;

    onLoad() {
        this.initEvent();
        this.initView();
    }

    initEvent() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUP, this);
    }

    initView() {

    }

    onKeyDown(e: cc.Event.EventKeyboard) {
        switch (e.keyCode) {
            case cc.macro.KEY.a:
                this.Player.scaleX = -1;
                this.mMove = true;
                this.mDirection = Direction.LEFT;
                break;
            case cc.macro.KEY.d:
                this.Player.scaleX = 1;
                this.mDirection = Direction.RIGHT;
                this.mMove = true;
                break;
            case cc.macro.KEY.space:
                break;
        }

        // if(this.mMove){
        //    更改动作
        // }
    }

    onKeyUP(e: cc.Event.EventKeyboard) {
        switch (e.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.d:
                this.mMove = false;
                break;
            case cc.macro.KEY.space:
                break;
        }
    }

    update(dt) {
        if (this.mMove) {
            this.Player.x += this.Speed * dt * this.mDirection;
        }
    }
}
