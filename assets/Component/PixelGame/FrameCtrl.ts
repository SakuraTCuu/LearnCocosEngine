const { ccclass, property } = cc._decorator;

@ccclass
export default class FrameCtrl extends cc.Component {

    @property
    _AutoPlay: boolean = false;
    @property
    get AutoPlay() { return this._AutoPlay }
    set AutoPlay(v: boolean) {
        this._AutoPlay = v;
    }
    @property({
        visible() {
            return this._AutoPlay
        }
    })
    LocalPath: string = "water_fall";
    @property({
        visible() {
            return this._AutoPlay
        }
    })
    Loop: boolean = true;

    @property({
        visible() {
            return this._AutoPlay
        },
        range: [0, 1]
    })
    Interval: number = 0.017;

    private mCallBack: Function = null;
    private mIsPlaying: boolean = false;
    private mFrameSprites: cc.SpriteFrame[] = [];
    private mIndex: number = -1;
    private mTargetSprite: cc.Sprite = null;

    onLoad() {
        this.mTargetSprite = this.node.getComponent(cc.Sprite);
        if (!this.mTargetSprite) {
            return cc.error("sprite is null");
        }

        if (this.AutoPlay) {
            cc.log("AutoPlay");
            this.loadAsset(this.LocalPath)
        }
    }

    loadAsset(act: string) {
        cc.resources.loadDir(`pixel/${act}`, cc.SpriteFrame, (err, res: cc.SpriteFrame[]) => {
            if (err) {
                return cc.error(err);
            }
            cc.log(`play ${act}`);
            this.playAction(res);
        })
    }

    /**
    * @title 播放动画（循环切换图片）
    */
    playAction(FrameSprites: cc.SpriteFrame[], interval: number = this.Interval, isLoop: boolean = this.Loop) {
        console.log(interval, isLoop);
        this.mIndex = -1;
        //取消调度
        this.unschedule(this.mCallBack);

        this.mFrameSprites = FrameSprites;
        this.mCallBack = () => {
            if (!isLoop && this.mIndex >= this.mFrameSprites.length) {
                return;
            }
            this.mIndex++;
            this.mTargetSprite.spriteFrame = this.mFrameSprites[this.mIndex % this.mFrameSprites.length];
        };
        this.mIsPlaying = true;

        this.schedule(this.mCallBack, interval);
    }

    /**
     * @title 停止动画
     */
    stopAction() {
        this.mIndex = -1;
        this.mIsPlaying = false;
        this.unschedule(this.mCallBack);
        this.mTargetSprite.spriteFrame = this.mFrameSprites[this.mFrameSprites.length - 1];
    }
}
