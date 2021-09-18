/**
 * 
 *
 * 一 用法说明：
 *      top:距离顶部的距离（默认20px）
 *      maxDistance：向下拉动触发callback的距离（默认150px）
 *      callback：回调函数
 *  二 温馨提示:
 *      1.此库不支持微信中游览器以及ie
 *      2.ios由于默认下拉样式，会显得有点奇怪
 *  三 举例说明:
 *      引入此js后
 *      new PullDownRefresh({
 *               top: 100,
 *               callback: function () {
 *         }})
 */
class PullDownRefresh {

    constructor({
        callback,
        top,
        maxDistance,
        
    }) {
        this.top = top || 20;
        this.callback = callback;
        this.maxDistance = maxDistance || 150;
        this.isEnd = false;
        this.isTouch = false;
        this.distance = 0;
        this.startY = 0;
        this.moveHandle = this.moveHandle1.bind(this)// 由于bind每次回新返回一个函数所以提前将他存起来为后面add，remove事件准备。
        this.init();
        this.timer2;
    }

    goBack() {
        const that = this;

        that.mainDom2.style.transition = 'all 0.3s';
        that.mainDom2.style.transform = `translateY(0px)`;
        that.mainDom2.style.opacity = '0';
        if (that.isEnd) {
            that.callback && that.callback();
        }
        if (this.timer2) clearInterval(this.timer2)

        this.timer2 = setInterval(() => {
            // 这个timer2是为了防止用户一直下滑手指不抬会导致的bug
            if (!that.isTouch) {
                clearInterval(this.timer2)
                that.initStatus();
            }
        }, 250);

    }

    init() {
        const that = this;
        const node1 = document.createElement('div');
        const node2 = document.createElement('div');
        node2.innerHTML = `<svg t="1631858427653" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2533" width="22" height="22"><path d="M71.037275 589.62282 343.25474 771.449571 293.661553 848.937992C354.738377 888.720061 426.716444 912.090533 504.085399 912.090533 673.24879 912.090533 817.384122 802.032783 874.652978 647.070874 894.693344 592.803593 926.172549 579.587703 953.425655 587.367905 917.541154 798.956542 733.862684 960.235198 512.059733 960.235198 291.033308 960.235198 107.832701 800.106399 71.037275 589.62282ZM954.396313 443.142974 680.356997 244.277431 723.842501 171.478038C663.527271 133.726886 593.027591 111.59587 517.361022 111.59587 343.971534 111.59587 196.745027 225.775185 141.641486 385.202123 131.800502 402.718777 103.188473 416.890393 75.382838 412.395497 120.749927 212.917692 298.843376 63.884268 512.059733 63.884268 736.087733 63.884268 921.169924 228.418363 954.396313 443.142974Z" p-id="2534" fill="#707070"></path></svg>`
        node1.style.cssText = `width:100%;position:fixed;top:${that.top}px;z-index:10000000;display:none`;
        node2.style.cssText =
            ' width: 32px; height: 32px; border-radius: 100%; background-color: white; margin: 0px auto; display: flex; justify-content: center;    align-items: center;box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.3);';

        node1.appendChild(node2);
        document.body.appendChild(node1);
        that.mainDom1 = node1;
        that.mainDom2 = node2;

        document.addEventListener('touchstart', function (e) {
            that.isTouch = true;
            that.startY = e.touches[0].pageY;
        });

        document.addEventListener('touchmove', that.moveHandle);
        document.addEventListener('touchend', function (e) {

            that.isTouch = false;
            // that.distance != 0    一个点击事件其实是触发了touchstart和touchend,这里算是一个优化，防止点击事件时候也触发goBack 
            if (!that.isEnd && that.distance != 0) {
                that.goBack();
            }
            if (that.isEnd) {
                that.goBack();
            }
        });
    }

    initStatus() {
        const that = this;
        that.mainDom2.style.transform = '';
        that.mainDom2.style.transition = '';
        that.mainDom1.style.display = 'none';
        that.isEnd = false;
        that.distance = 0;
    }
    moveHandle1(e) {

        if (e.touches[0].pageY > this.startY && document.documentElement.scrollTop <=
            0) { //判断用户下拉 ios可能会小于零
            if (this.distance < this.maxDistance && !this
                .isEnd) { // 这里要注意下拉到maxDistance 和没到maxDistance是两种状态，下拉到maxDistance后会触发callback
                if (this.mainDom1.style.display != 'block') {
                    this.mainDom1.style.display = 'block';
                }

                this.distance = e.touches[0].pageY - this.startY;
                this.mainDom2.style.transform =
                    `translateY(${this.distance * 0.6}px) rotate(${this.distance * 1.5}deg) `;
                this.mainDom2.style.opacity = `${this.distance / this.maxDistance}`;
            } else {
                this.isEnd = true;
            }
        }
    }
}
window.PullDownRefresh = PullDownRefresh;
