const { ccclass, property } = cc._decorator;

@ccclass
export default class Ray extends cc.Component {

    @property(cc.Graphics)
    Graphics: cc.Graphics = null;

    @property(cc.Node)
    TestNode: cc.Node = null;


    lineArr = [{
        p1: { x: -400, y: -200 },
        p2: { x: -400, y: 200 },
    }, {
        p1: { x: -400, y: 200 },
        p2: { x: 400, y: 200 },
    },
    {
        p1: { x: 400, y: 200 },
        p2: { x: 400, y: -200 },
    },
    {
        p1: { x: 400, y: -200 },
        p2: { x: -400, y: -200 },
    }];

    /**
     * 射线检测 ? 
     */
    onLoad() {

        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);

        this.test();
        this.initWall();
    }

    touchStart(e: cc.Event.EventTouch) {
        this.showRayLine(e);
    }

    touchMove(e: cc.Event.EventTouch) {
        this.showRayLine(e);
    }

    touchEnd(e: cc.Event.EventTouch) {
        this.showRayLine(e);
    }

    initWall() {
        for (let i = 0; i < this.lineArr.length; i++) {
            this.showGraphicsLine(this.lineArr[i].p1, this.lineArr[i].p2);
        }
    }

    showGraphicsLine(startPos: any, endPos: any, color: cc.Color = cc.Color.GRAY) {
        this.Graphics.moveTo(startPos.x, startPos.y);
        this.Graphics.lineTo(endPos.x, endPos.y);
        this.Graphics.strokeColor = color;
        this.Graphics.stroke();
    }

    test() {
        let pos = cc.v2(400, 33.378932968536255);

        //原始位置
        let oriPos = cc.v2(this.TestNode.position);

        let subPos = pos.sub(oriPos);
        let ratio = this.getRatio(pos, oriPos);

        //计算直线 直射的终点
        let endX = 500 * subPos.x;
        let endY = endX * ratio;
        let endPos = cc.v2(endX, endY);

        //绘制墙
        this.initWall();
        this.recycleCalc2(oriPos, endPos, 5);
    }


    /**
     * 循环计算
     * @param reflectCount 反射次数
     */
    recycleCalc2(s1: cc.Vec2, s2: cc.Vec2, reflectCount: number = 2) {

        if (reflectCount <= 0) {
            return;
        }

        let targetPos: cc.Vec2 = null;
        let p1: cc.Vec2, p2: cc.Vec2;
        //交点
        for (let i = 0; i < this.lineArr.length; i++) {
            let line = this.lineArr[i];
            //遍历所有的线段,判断是否相交
            let result = this.segmentsIntr(s1, s2, line.p1, line.p2);

            if (result) { //相交一个就可以打断
                if (result.x === s1.x && result.y === s1.y) { //发射点不算在内
                    continue;
                }
                targetPos = cc.v2(result);
                p1 = cc.v2(line.p1);
                p2 = cc.v2(line.p2);
                break;
            }
        }

        if (!targetPos) {
            console.error("未碰撞");
            return;
        }

        console.log("划线,", targetPos.x, targetPos.y);

        this.showGraphicsLine(s1, targetPos, cc.Color.RED);

        //生成反射线段
        let normal = p2.sub(p1);
        //计算法向量
        if (normal.x === 0) {
            if (normal.y > 0) {
                normal = cc.v2(1, 0);
            } else {
                normal = cc.v2(-1, 0);
            }
        } else {
            if (normal.x > 0) {
                normal = cc.v2(0, -1);
            } else {
                normal = cc.v2(0, 1);
            }
        }

        //绘制法向量
        // this.showGraphicsLine(targetPos, targetPos.add(normal.mul(100)), cc.Color.GREEN);

        //入射向量归一化
        let curVec = s2.sub(s1).normalize();
        //反射向量
        let proj = curVec.dot(normal);
        normal = normal.mul(2 * proj)
        let resultVec = curVec.sub(normal);
        resultVec = resultVec.mul(1000);
        //下一个的终点
        const endPos = s1.add(resultVec);

        this.recycleCalc2(targetPos, endPos, reflectCount - 1)
    }


    /**
     * 循环计算
     * @param reflectCount 反射次数
     */
    recycleCalc(s1: cc.Vec2, s2: cc.Vec2, reflectCount: number = 2) {

        if (reflectCount <= 0) {
            return;
        }

        let targetPos: cc.Vec2 = null;
        let p1: cc.Vec2, p2: cc.Vec2;
        //交点
        for (let i = 0; i < this.lineArr.length; i++) {
            let line = this.lineArr[i];
            //遍历所有的线段,判断是否相交
            let result = this.segmentsIntr(s1, s2, line.p1, line.p2);
            if (result) { //相交一个就可以打断
                targetPos = cc.v2(result);
                p1 = cc.v2(line.p1);
                p2 = cc.v2(line.p2);
                break;
            }
        }

        if (!targetPos) {
            console.error("未碰撞");
            return;
        }

        console.log("划线");

        this.showGraphicsLine(s1, targetPos, cc.Color.RED);

        // console.log(p1.x, p1.y);
        // console.log(p2.x, p2.y);
        // console.log(targetPos.x, targetPos.y);

        //交点
        // this.Graphics.circle(targetPos.x, targetPos.y, 10)
        // this.Graphics.strokeColor = cc.Color.GREEN;
        // this.Graphics.stroke();

        //计算入射角度 
        let angle = Math.atan2(targetPos.y - s1.y, targetPos.x - s1.x) * 180 / Math.PI;
        if (p1.x - p2.x !== 0) {
            angle = Math.atan2(s1.y - targetPos.y, s1.x - targetPos.x) * 180 / Math.PI;
        }
        // (0,200) 与 oriPos的夹角
        // let angle = Math.atan2(s1.y - targetPos.y, s1.x - targetPos.x) * 180 / Math.PI;
        // let angle = Math.atan2(targetPos.y - s1.y, targetPos.x - s1.x) * 180 / Math.PI;
        //计算 反射角度
        angle = 180 - angle;
        console.log(angle);
        let degress = angle * Math.PI / 180;
        //射线长
        let dis = targetPos.sub(s1).len();
        //计算反射后的终点
        let reflectX = dis * Math.cos(degress);
        let reflectY = dis * Math.sin(degress);

        let reflectEndPos = cc.v2(reflectX, reflectY);
        //转换下坐标系 原本是以oriPos为坐标系,现在是以touchPos为坐标系
        reflectEndPos.addSelf(targetPos);

        //延长射线
        let subPos = reflectEndPos.sub(targetPos);
        let ratio = this.getRatio(reflectEndPos, targetPos);

        //计算直线 直射的终点
        let endX = 1000 * subPos.x;
        let endY = endX * ratio;
        let endPos = cc.v2(endX, endY);

        this.recycleCalc(targetPos, endPos, reflectCount - 1)

    }

    getRatio(pos: cc.Vec2, oriPos: cc.Vec2) {
        let subPos = pos.sub(oriPos);
        if (subPos.x === 0) {
            subPos.x = 0.0001;
        }
        return subPos.y / subPos.x;
    }

    /**
     * 展示射线
     */
    showRayLine(e: cc.Event.EventTouch) {
        console.clear();
        this.Graphics.clear();

        let pos = e.getLocation();

        //点击位置
        pos = this.node.convertToNodeSpaceAR(pos);

        //原始位置
        let oriPos = cc.v2(this.TestNode.position);

        let subPos = pos.sub(oriPos);
        let ratio = this.getRatio(pos, oriPos);

        //计算直线 直射的终点
        let endX = 500 * subPos.x;
        let endY = endX * ratio;
        let endPos = cc.v2(endX, endY);

        //绘制墙
        this.initWall();
        this.recycleCalc2(oriPos, endPos, 5);
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
