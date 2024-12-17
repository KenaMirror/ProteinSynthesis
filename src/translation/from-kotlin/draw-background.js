Tabs.translation.registerSetup(() => {
    (function () {
        'use strict';
        //region block: pre-declaration
        //endregion
        function set_style(value) {
            this.strokeStyle = value;
            this.fillStyle = value;
        }

        function main$toDouble_(_this__u8e3s4) {
            return _this__u8e3s4;
        }

        function line(ctx, x1, y1, x2, y2) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        function fillCenterRect(ctx, x, y, w, h) {
            return ctx.fillRect(x - w / 2, y - h / 2, w, h);
        }

        function main$draw$sin(radians, scl, mag) {
            return Math.sin(radians / scl) * mag;
        }

        function mySin(time) {
            return Math.max(0.0, main$draw$sin(time, 16.0, 1.0)) * 0.9 + 0.1;
        }

        function even(it) {
            return Math.round(it / 2) * 2
        }

        MAIN_WINDOW.backgroundDrawer = {
            paneOutlineColor: "gray",
            paneBackgroundColor: "gray",
            firstLayerColor: "gray",
            secondLayerColor: "gray",
            thirdLayerColor: "gray",
            draw(elm, posx, posy, posz, firstLayerIndex, secondLayerIndex, thirdLayerIndex, selection, time) {
                let ctx = elm.getContext('2d');
                ctx.set_style = set_style
                ctx.clearRect(0.0, 0.0, elm.width * 1.0, elm.height * 1.0);
                elm.width = elm.clientWidth;
                elm.height = elm.clientHeight;
                let devicePixelRatio = even(4.0 );
                let stroke = devicePixelRatio;
                let halfStroke = stroke / 2.0;
                ctx.lineWidth = devicePixelRatio;
                ctx.set_style(this.paneOutlineColor);
                ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, elm.width - ctx.lineWidth, elm.height - ctx.lineWidth);
                ctx.lineWidth = stroke;
                let pad = {
                    left: devicePixelRatio,
                    right: devicePixelRatio,
                    bottom: thirdLayerIndex === 3 ? devicePixelRatio : 0.0,
                    top: thirdLayerIndex === 0 ? devicePixelRatio : 0.0,
                }
                let delta = {
                    x: pad.left,
                    y: pad.top,
                    width: -(pad.left + pad.right),
                    height: -(pad.top + pad.bottom)
                }
                let hasFirst = posx === firstLayerIndex;
                let hasSecond = posy === secondLayerIndex;
                let hasThird = posz === thirdLayerIndex && hasFirst;
                let width = elm.width + delta.width;
                let height = elm.height + delta.height;
                let x = delta.x;
                let y = delta.y;
                ctx.clearRect(x, y, width, height);

                ctx.set_style(this.paneBackgroundColor);
                ctx.fillRect(x, y, width, height);
                /*
                let sameFirstAndSecond = posx === posy ? firstLayerIndex === secondLayerIndex : false;
                let sameFirstAndThird = posx === posz ? firstLayerIndex === thirdLayerIndex : false;
                let sameSecondAndThird = posy === posz ? secondLayerIndex === thirdLayerIndex : false;*/
                let firstLayerColor = this.firstLayerColor;
                let secondLayerColor = this.secondLayerColor;
                let thirdLayerColor = this.thirdLayerColor;
                if (hasThird) {
                    ctx.set_style(thirdLayerColor);
                    let cx = x + width / 2.0;
                    let cy = y + height / 2.0;
                    let tmp = hasFirst ? 1.0 : 0.0;
                    let tmp2 = hasSecond ? 1.0 : 0.0;
                    let sizeOffset = stroke * (tmp + tmp2) * 2;
                    fillCenterRect(ctx, cx, cy, width - sizeOffset, height - sizeOffset);
                }
                if (hasSecond) {
                    ctx.set_style(secondLayerColor);
                    let cx_0 = x + width / 2.0;
                    let cy_0 = y + height / 2.0;
                    let tmp$ret$4 = hasFirst ? 1.0 : 0.0;
                    let sizeOffset_0 = stroke * tmp$ret$4 * 2.0;
                    if (!hasThird) {
                        fillCenterRect(ctx, cx_0, cy_0, width - sizeOffset_0, height - sizeOffset_0);
                    } else {
                        ctx.strokeRect(x + (stroke + sizeOffset_0) / 2.0, y + (stroke + sizeOffset_0) / 2.0, width - stroke - sizeOffset_0, height - stroke - sizeOffset_0);
                    }
                }
                if (hasFirst) {
                    ctx.set_style(firstLayerColor);
                    let cx_1 = x + width / 2.0;
                    let cy_1 = y + height / 2.0;
                    if (!hasThird ? !hasSecond : false) {
                        fillCenterRect(ctx, cx_1, cy_1, width, height);
                    } else {
                        ctx.fillRect(x, y, stroke, stroke);
                        ctx.fillRect(x + width - stroke, y, stroke, stroke);
                        ctx.fillRect(x + width - stroke, y + height - stroke, stroke, stroke);
                        ctx.fillRect(x, y + height - stroke, stroke, stroke);
                        x = x + halfStroke;
                        y = y + halfStroke;
                        width = width - stroke;
                        height = height - stroke;
                        ctx.set_style(firstLayerColor);
                        if ((secondLayerIndex < 3 ? hasThird : false) ? !(posy === secondLayerIndex) : false)
                            ctx.set_style(thirdLayerColor);
                        line(ctx, x + width, y + halfStroke, x + width, y + height - halfStroke);
                        ctx.set_style(firstLayerColor);
                        if ((secondLayerIndex > 0 ? hasThird : false) ? !(posy === secondLayerIndex) : false)
                            ctx.set_style(thirdLayerColor);
                        line(ctx, x, y + halfStroke, x, y + height - halfStroke);
                        ctx.stroke();
                        ctx.set_style(firstLayerColor);
                        if ((posy === secondLayerIndex ? thirdLayerIndex < 3 : false) ? hasSecond : false)
                            ctx.set_style(secondLayerColor);
                        line(ctx, x + halfStroke, y + height, x + width - halfStroke, y + height);
                        ctx.set_style(firstLayerColor);
                        if ((posy === secondLayerIndex ? thirdLayerIndex > 0 : false) ? hasSecond : false)
                            ctx.set_style(secondLayerColor);
                        line(ctx, x + halfStroke, y, x + width - halfStroke, y);
                        x = x - halfStroke;
                        y = y - halfStroke;
                        width = width + stroke;
                        height = height + stroke;
                    }
                }
                if (((hasFirst ? hasSecond : false) ? hasThird : false) ? selection : false) {
                    let cx_2 = x + width / 2.0;
                    let cy_2 = y + height / 2.0;
                    let pi = Math.PI;
                    let delta = 8 * pi;
                    let alphaFirst = mySin(time);
                    let alphaSecond = mySin(time - delta);
                    let alphaThird = mySin(time - 2 * delta);
                    ctx.set_style('rgba(255, 211, 127, ' + alphaFirst + ')');
                    ctx.strokeRect(x + stroke / 2.0, y + stroke / 2.0, width - stroke, height - stroke);
                    ctx.set_style('rgba(255, 211, 127, ' + alphaSecond + ')');
                    ctx.strokeRect(x + stroke * 3.0 / 2.0, y + stroke * 3.0 / 2.0, width - stroke * 3.0, height - stroke * 3.0);
                    ctx.set_style('rgba(255, 211, 127, ' + alphaThird + ')');
                    fillCenterRect(ctx, cx_2, cy_2, width - stroke * 4.0, height - stroke * 4.0);
                }
                ctx.set_style('rgba(0,0,0,0)');
            }
        };
    })()
})