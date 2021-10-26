const { ccclass, property } = cc._decorator;

  @ccclass
  export default class Outline2Ctrl extends cc.Component {
      @property(cc.Node)
      TestNode: cc.Node = null;

  }  
  