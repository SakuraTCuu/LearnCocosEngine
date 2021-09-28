import BezierItem from "./BezierItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TweenTest extends cc.Component {

    @property(cc.Sprite)
    Background: cc.Sprite = null;

    @property(cc.Node)
    TestNode: cc.Node = null;

    @property(cc.Prefab)
    BezierPrefab: cc.Prefab = null;

    @property(cc.Node)
    ContentNode: cc.Node = null;

    private itemArr: Array<cc.Node> = [];

    private debug: boolean = true;

    private mResult: Array<Array<cc.Vec3>> = [];

    p1: cc.Vec3 = null;
    p2: cc.Vec3 = null;
    p3: cc.Vec3 = null;

    start() {
        
        //TODO:  动态添加元素
        /**
         * 1. 选择文件
         * 2. 展示背景
         * 3. 编辑导出
         * 4. 程序解析运行
         */
        window.onSelectImage = () => {
            var docObj = document.getElementById("doc");

            var imgObjPreview = document.getElementById("preview");
            if (docObj.files && docObj.files[0]) {
                //火狐下，直接设img属性
                imgObjPreview.style.display = 'block';
                imgObjPreview.style.width = '150px';
                imgObjPreview.style.height = '180px';
                //imgObjPreview.src = docObj.files[0].getAsDataURL();

                console.log(docObj.files[0]);
                //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
                imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);

                this.scheduleOnce(() => {
                    let tex = new cc.Texture2D();
                    tex.initWithElement(imgObjPreview);
                    this.Background.spriteFrame = new cc.SpriteFrame(tex);
                }, 2)
            }
        }

        // this.addWebElement();
    }

    addWebElement() {

        var _tr = document.createElement("tr");

        _tr.innerHTML =
            `<td height="101" align="center">
            <div id="localImag">
                <img id="preview" src="http://blog.chuangling.net/Public/images/top.jpg" width="150" height="180" style="display: block; width: 150px; height: 180px;">
            </div>
         </td>
        `
        var body = document.body;
        body.appendChild(_tr);

        _tr = document.createElement("tr");

        var td1 = document.createElement("td");
        td1.innerHTML = `<input type="file" name="file" id="doc" style="width:150px;" onchange="javascript:onSelectImage();">`

        _tr.appendChild(td1);

        var body = document.body;
        body.appendChild(_tr);
        // document.documentElement.innerHTML += `<input type="file" name="file" id="doc" style="width:150px;" onchange="javascript:onSelectImage();">`
    }

    onClickExport() {

        this.mResult = [];
        /**
         * 获取所有的位置信息
         */
        for (let i = 0; i < this.itemArr.length; i++) {
            let itemCtrl = this.itemArr[i].getComponent(BezierItem);
            let posList = itemCtrl.exportData();
            this.mResult.push(posList);
        }
        console.log(JSON.stringify(this.mResult));
    }

    onClickRun() {
        if (this.itemArr.length === 0) {
            return;
        }
        /**
         * 获取所有的位置信息
         */
        let tween = cc.tween(this.TestNode);

        for (let i = 0; i < this.itemArr.length; i++) {
            let itemCtrl = this.itemArr[i].getComponent(BezierItem);
            let posList = itemCtrl.exportData();
            let startPos = itemCtrl.getStartPosition();
            tween
                .to(0, { position: startPos })
                .bezierTo(2, ...posList);
        }
        tween.start();
    }

    onShowDebug() {
        this.debug = !this.debug;
        this.itemArr.forEach(item => {
            item.getComponent(BezierItem).showDebug(this.debug);
        })
    }

    /**
     * 添加一个贝塞尔曲线编辑
     */
    addBezierItem() {
        let item = cc.instantiate(this.BezierPrefab);
        let lastNode = this.itemArr[this.itemArr.length - 1];
        let pos;
        if (lastNode) {
            pos = lastNode.getComponent(BezierItem).getEndPosition();
        } else {
            pos = cc.v3(-300, 0);
        }
        item.position = pos;
        item.name = this.itemArr.length + 1 + "";
        item.parent = this.ContentNode;
        this.itemArr.push(item);
    }

    /**
     * 删除一个item
     */
    delBezierItem() {
        if (this.itemArr.length === 0) {
            return;
        }
        let item = this.itemArr.splice(this.itemArr.length - 1, 1)[0];
        item.destroy();
    }
}
