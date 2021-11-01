import Android from "./Android";
import AppSdk from "./AppSdk";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Native extends cc.Component {


    /**
     * 原生方法 调用测试
     * TODO: 相册选择
     */
    onLoad() {
        Android.showPicture();
        AppSdk.showPicture();
    }

    start() {

    }
}
