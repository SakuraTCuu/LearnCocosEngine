const { ccclass, property } = cc._decorator;

@ccclass
export default class TweenTest extends cc.Component {

    @property(cc.Node)
    TestNode: cc.Node = null;

    start() {
        let tween = cc.tween();
        for (let i = 0; i < 10; i++) {
            tween.by(0.2, { position: cc.v2(20, 0) })
        }
        tween
            .target(this.TestNode)
            .call(() => {
                console.log("over");
            })
            .start();
    }
}
