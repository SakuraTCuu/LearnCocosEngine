const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    TestNode: cc.Node = null;

    onLoad () {

    }
}
