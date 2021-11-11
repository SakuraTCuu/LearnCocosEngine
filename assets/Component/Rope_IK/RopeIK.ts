const { ccclass, property } = cc._decorator;

/**
 * 灵感来源: https://forum.cocos.org/t/topic/87943
 * 反向动力学
 */
@ccclass
export default class Ray extends cc.Component {

    @property(cc.Graphics)
    Graphics: cc.Graphics = null;

    @property(cc.Node)
    TestNode: cc.Node = null;

    mDotList: Array<cc.Node> = [];

    mStepLen: number = 40;

    /**
     * 
     */
    onLoad() {
        //生成20个节点
        for (let i = 0; i < 40; i++) {
            let node = cc.instantiate(this.TestNode);
            node.parent = this.node;
            this.mDotList[i] = node;
        }

        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }

    touchStart(e: cc.Event.EventTouch) {

    }

    touchMove(e: cc.Event.EventTouch) {
        let dotNode = this.mDotList[0];
        dotNode.x += e.getDeltaX();
        dotNode.y += e.getDeltaY();

        //计算移动
        this.calcMove(cc.v2(dotNode.position));
        //更新连线
        this.updateGraphics();
    }

    touchEnd(e: cc.Event.EventTouch) {
        let dotNode = this.mDotList[0];
        //计算移动
        this.calcMove(cc.v2(dotNode.position));
        this.updateGraphics();
    }

    calcMove(pos: cc.Vec2, i?: number) {
        i = i || 1;

        if (i >= this.mDotList.length) {
            return;
        }

        let curNode = this.mDotList[i];

        let curPos = cc.v2(curNode.position);
        let disVec = pos.sub(curPos); //距离

        let len = disVec.len();

        if (len < this.mStepLen) { //短,不足以移动
            return;
        }

        //计算夹角
        let angle = Math.atan2(disVec.y, disVec.x);

        //计算curNode到pos的距离为mStepLen 的点;
        let x = this.mStepLen * Math.cos(angle);
        let y = this.mStepLen * Math.sin(angle);

        //总距离减去目标点的位置, 即得到要移动的距离
        let resultVec = disVec.sub(cc.v2(x, y));

        //当前位置加上要移动的距离
        curNode.position = cc.v3(curPos.add(resultVec));

        //计算下一个点的移动
        this.calcMove(cc.v2(curNode.x, curNode.y), ++i);
    }

    updateGraphics() {
        this.Graphics.clear();
        let headNode = this.mDotList[0];
        for (let i = 1; i < this.mDotList.length; i++) {
            let curNode = this.mDotList[i];
            this.showGraphicsLine(headNode.position, curNode.position);
            headNode = curNode;
        }
    }

    showGraphicsLine(startPos: any, endPos: any, color: cc.Color = cc.Color.GREEN) {
        this.Graphics.moveTo(startPos.x, startPos.y);
        this.Graphics.lineTo(endPos.x, endPos.y);
        this.Graphics.strokeColor = color;
        this.Graphics.stroke();
    }
}
