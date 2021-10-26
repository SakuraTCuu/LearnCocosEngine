const { ccclass, property } = cc._decorator;

@ccclass
export default class Ray extends cc.Component {

    @property(cc.Graphics)
    Graphics: cc.Graphics = null;

    @property(cc.Node)
    TestNode: cc.Node = null;

    /**
     * 射线检测 ? 
     */
    onLoad() {

        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    }

    touchStart(e: cc.Event.EventTouch) {
        this.showGraphicsLine(e);
    }

    touchMove(e: cc.Event.EventTouch) {
        this.showGraphicsLine(e);
    }

    touchEnd(e: cc.Event.EventTouch) {
        this.showGraphicsLine(e);
    }

    /**
     * 展示射线
     */
    showGraphicsLine(e: cc.Event.EventTouch) {

        this.Graphics.clear();

        let pos = e.getLocation();

        //点击位置
        pos = this.node.convertToNodeSpaceAR(pos);

        //原始位置
        let oriPos = cc.v2(this.TestNode.position);

        //计算终点位置   以屏幕正中心为原点建立坐标系, 
        //  y = kx+b;   k = y / x;
        //  oriPos.x * k + b = oriPos.y;   b = oriPos.y - oriPos.x * k
        //  pos.x * k + b = pos.y;         

        // cc.log(pos.x, pos.y, oriPos.x, oriPos.y);

        let subPos = pos.sub(oriPos);

        if (subPos.x === 0) {
            subPos.x = 0.01;
        }

        let ratio = subPos.y / subPos.x;

        //计算直线 直射的终点
        let endX = 1000 * subPos.x;
        let endY = endX * ratio;
        let endPos = cc.v3(endX, endY);

        //绘制 直射线
        this.Graphics.moveTo(oriPos.x, oriPos.y);
        this.Graphics.lineTo(endPos.x, endPos.y);
        this.Graphics.strokeColor = cc.Color.RED;
        this.Graphics.stroke();

        //与镜面相交
        let mirrorStartPos = cc.v2(0, -320);
        let mirrorEndPos = cc.v2(480, 0);

        //绘制镜面
        this.Graphics.moveTo(mirrorStartPos.x, mirrorStartPos.y);
        this.Graphics.lineTo(mirrorEndPos.x, mirrorEndPos.y);
        this.Graphics.strokeColor = cc.Color.BLUE;
        this.Graphics.stroke();


        //开始计算反射
        let result = this.segmentsIntr(oriPos, endPos, mirrorStartPos, mirrorEndPos);
        // let result = this.segmentsIntr(cc.v2(-100, 0), cc.v2(100, 0), cc.v2(0, -100), cc.v2(0, 100));
        if (!result) {
            cc.log("不相交");
            return;
        }

        let { x, y } = result;

        //TODO: 下边反射计算不对, 重新计算一下

        //判断有没有交点   
        //只有同方向的才有相交的可能, 不同方向的不可能相交
        // cc.Intersection.lineLine() 也可以判断相交
        if (x === 0 || subPos.x > 0 && x < 0 || subPos.x < 0 && x > 0) {
            return;
        }

        //交点
        let touchPos = cc.v2(x, y);

        this.Graphics.circle(x, y, 10)
        this.Graphics.strokeColor = cc.Color.GREEN;
        this.Graphics.stroke();

        //计算入射角度 
        // (0,200) 与 oriPos的夹角
        let angle = Math.atan2(oriPos.y - touchPos.y, oriPos.x - touchPos.x) * 180 / Math.PI;
        //计算 反射角度
        angle = 180 - angle;
        let degress = angle * Math.PI / 180;
        //射线长
        let dis = touchPos.sub(oriPos).len();

        //计算反射后的终点
        let reflectX = dis * Math.cos(degress);
        let reflectY = dis * Math.sin(degress);

        let reflectEndPos = cc.v2(reflectX, reflectY);
        //转换下坐标系 原本是以oriPos为坐标系,现在是以touchPos为坐标系
        reflectEndPos.addSelf(touchPos);

        //绘制 直射线
        this.Graphics.moveTo(touchPos.x, touchPos.y);
        this.Graphics.lineTo(reflectEndPos.x, reflectEndPos.y);
        this.Graphics.strokeColor = cc.Color.WHITE;
        this.Graphics.stroke();
    }

    /**
     * 计算相交点
     * @param a 
     * @param b 
     * @param c 
     * @param d 
     * @returns 
     */
    segmentsIntr(a, b, c, d) {
        /** 1 解线性方程组, 求线段交点. **/
        // 如果分母为0 则平行或共线, 不相交  
        var denominator = (b.y - a.y) * (d.x - c.x) - (a.x - b.x) * (c.y - d.y);
        if (denominator == 0) {
            return false;
        }

        // 线段所在直线的交点坐标 (x , y)      
        var x = ((b.x - a.x) * (d.x - c.x) * (c.y - a.y)
            + (b.y - a.y) * (d.x - c.x) * a.x
            - (d.y - c.y) * (b.x - a.x) * c.x) / denominator;
        var y = -((b.y - a.y) * (d.y - c.y) * (c.x - a.x)
            + (b.x - a.x) * (d.y - c.y) * a.y
            - (d.x - c.x) * (b.y - a.y) * c.y) / denominator;

        /** 2 判断交点是否在两条线段上 **/
        if (
            // 交点在线段1上  
            (x - a.x) * (x - b.x) <= 0 && (y - a.y) * (y - b.y) <= 0
            // 且交点也在线段2上  
            && (x - c.x) * (x - d.x) <= 0 && (y - c.y) * (y - d.y) <= 0
        ) {
            // 返回交点p  
            return {
                x: x,
                y: y
            }
        }
        //否则不相交  
        return false
    }
}
