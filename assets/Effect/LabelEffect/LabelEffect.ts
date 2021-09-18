const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    TestLabel: cc.Label = null;

    mMaterial: cc.MaterialVariant = null;

    onLoad() {
        this.mMaterial = this.TestLabel.getMaterial(0);
    }

    start() {
        cc.director.once(cc.Director.EVENT_AFTER_DRAW, () => {
            this.resetLabel();
        })
    }

    /**
     * Label -> RichText
     * 
     * TODO: 字符宽度,需要研究
     */
    resetLabel() {
        let width = this.TestLabel.node.width;  //总长度
        let len = this.TestLabel.string.length; //字符个数
        let spacingX = this.TestLabel.spacingX; // 字符间间距
        let size = this.TestLabel.fontSize;   //字符宽度

        //先假设只有一行
        //确定第几个字符需要变色   假设第三个
        let testNum = 3;

        if (len < testNum) {
            return;
        }

        let x = (size + spacingX) * (testNum - 1); //左边x
        let x2 = (size + spacingX) * testNum; //右边的x

        let u = x / width;
        let u2 = x2 / width;
        console.log(u, u2)
        this.mMaterial.setProperty("uvs", new cc.Vec4(u, u2, 0, 0));
    }
}
