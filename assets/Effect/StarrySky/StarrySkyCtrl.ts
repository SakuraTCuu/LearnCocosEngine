const { ccclass, property } = cc._decorator;

  @ccclass
  export default class StarrySkyCtrl extends cc.Component {

      @property(cc.Node)
      TestNode: cc.Node = null;
      

  }