import Android from "./Android";
import IOS from "./IOS";

const OS = cc.sys.os === cc.sys.OS_ANDROID ? Android : IOS;
export default OS
