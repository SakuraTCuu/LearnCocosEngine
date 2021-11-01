const { ccclass, property } = cc._decorator;

@ccclass
export default class OriEffectCtrl extends cc.Component {
  @property(cc.Node)
  TestNode: cc.Node = null;

  mMaterial: cc.MaterialVariant = null;

  onLoad() {

  }

  start() {
    this.mMaterial = this.TestNode.getComponent(cc.Sprite).getMaterial(0);
  }

}
