const { ccclass, property } = cc._decorator;

@ccclass
export default class OutlineCtrl extends cc.Component {

  @property(cc.Node)
  TestNode: cc.Node = null;

}
