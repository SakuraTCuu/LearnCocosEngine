const { ccclass, property } = cc._decorator;

@ccclass
export default class BezierItem extends cc.Component {

    @property(cc.Node)
    StartNode: cc.Node = null;
    @property(cc.Node)
    Ctrl1Node: cc.Node = null;
    @property(cc.Node)
    Ctrl2Node: cc.Node = null;
    @property(cc.Node)
    EndNode: cc.Node = null;

    @property(cc.Graphics)
    Graphics: cc.Graphics = null;

    firt: cc.Vec2 = null;
    c1: cc.Vec2 = null;
    c2: cc.Vec2 = null;
    target: cc.Vec2 = null;

    debug: boolean = true;

    onLoad() {
        this.StartNode.getChildByName("Label").getComponent(cc.Label).string = this.node.name;
        this.Ctrl1Node.getChildByName("Label").getComponent(cc.Label).string = this.node.name;
        this.Ctrl2Node.getChildByName("Label").getComponent(cc.Label).string = this.node.name;
        this.EndNode.getChildByName("Label").getComponent(cc.Label).string = this.node.name;
    }

    start() {
        //移动到左下角
        this.addDragEvent(this.StartNode, 1);
        this.addDragEvent(this.Ctrl1Node, 2);
        this.addDragEvent(this.Ctrl2Node, 3);
        this.addDragEvent(this.EndNode, 4);

        this.draw();
    }

    public showDebug(flag: boolean) {
        this.debug = flag;
        this.draw();
    }

    private addDragEvent(node: cc.Node, type): void {

        let updateState = (pos: cc.Vec2) => {
            switch (type) {
                case 1: this.firt = pos; break;
                case 2: this.c1 = pos; break;
                case 3: this.c2 = pos; break;
                case 4: this.target = pos; break;
            }

            this.draw();
        }

        let onTouchStart = (event: cc.Event.EventTouch) => {

        }

        let onTouchMove = (event: cc.Event.EventTouch) => {
            node.x += event.getDeltaX();
            node.y += event.getDeltaY();

            let pos = event.getLocation();
            pos = node.parent.convertToNodeSpaceAR(pos);

            updateState(pos);
        }

        let onTouchEnd = (event: cc.Event.EventTouch) => {
            let pos = event.getLocation();
            pos = node.parent.convertToNodeSpaceAR(pos);

            updateState(pos);
        }

        node.on(cc.Node.EventType.TOUCH_START, onTouchStart, this);
        node.on(cc.Node.EventType.TOUCH_MOVE, onTouchMove, this);
        node.on(cc.Node.EventType.TOUCH_CANCEL, onTouchEnd, this);
        node.on(cc.Node.EventType.TOUCH_END, onTouchEnd, this);
    }

    draw() {
        let ctx = this.Graphics;
        cc.director.once(cc.Director.EVENT_AFTER_DRAW, () => {
            ctx.clear();

            let startPos = this.StartNode.position;
            let c1Pos = this.Ctrl1Node.position;
            let c2Pos = this.Ctrl2Node.position;
            let endPos = this.EndNode.position;

            //辅助线
            if (this.debug) {
                ctx.moveTo(startPos.x, startPos.y);
                ctx.lineTo(c1Pos.x, c1Pos.y);
                ctx.stroke();
                ctx.moveTo(endPos.x, endPos.y);
                ctx.lineTo(c2Pos.x, c2Pos.y);
                ctx.stroke();
            }

            //贝塞尔曲线
            ctx.moveTo(startPos.x, startPos.y);
            ctx.bezierCurveTo(c1Pos.x, c1Pos.y, c2Pos.x, c2Pos.y, endPos.x, endPos.y);
            ctx.stroke();
        })
    }

    getEndPosition(): cc.Vec3 {
        return this.node.position.add(this.EndNode.position).add(cc.v3(150, 0, 0));
    }

    getStartPosition(): cc.Vec3 {
        return this.node.position.add(this.StartNode.position);
    }

    exportData() {
        let startPos = this.node.position.add(this.StartNode.position);
        let c1Pos = this.node.position.add(this.Ctrl1Node.position);
        let c2Pos = this.node.position.add(this.Ctrl2Node.position);
        let endPos = this.node.position.add(this.EndNode.position);
        return [
        //    startPos,
           c1Pos,
           c2Pos,
           endPos,
        ];
    }
}
