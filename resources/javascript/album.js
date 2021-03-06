/**
 * Created by zhouyong on 3/19/15.
 */
// =============================================================
//           ===== 3D gallery experiment =====
// script written by Gerard Ferrandez - April 5, 2010
// http://www.dhteumeuleu.com
// use under a CC-BY-NC license
// -------------------------------------------------------------
// update: April 17 : added hyperlinks, tweaked z-index
// =============================================================

var m3D = function () {
    /* ---- private vars ---- */
    var diapo = [],
        imb,
        scr,
        bar,
        selected,
        urlInfo,
        imagesPath = "/resources/images/",
        camera = {x:0, y:0, z:-650, s:0, fov: 500},
        nw = 0,
        nh = 0;
    /* ==== camera tween methods ==== */
    camera.setTarget = function (c0, t1, p) {
        if (Math.abs(t1 - c0) > .1) {
            camera.s = 1;
            camera.p = 0;
            camera.d = t1 - c0;
            if (p) {
                camera.d *= 2;
                camera.p = 9;
            }
        }
    }
    camera.tween = function (v) {
        if (camera.s != 0) {
            camera.p += camera.s;
            camera[v] += camera.d * camera.p * .01;
            if (camera.p == 10) camera.s = -1;
            else if (camera.p == 0) camera.s = 0;
        }
        return camera.s;
    }
    /* ==== diapo constructor ==== */
    var Diapo = function (n, img, x, y, z) {
        if (img) {
            this.url = img.url;
            this.title = img.title;
            this.color = img.color;
            this.isLoaded = false;
            if (document.createElement("canvas").getContext) {
                /* ---- using canvas in place of images (performance trick) ---- */
                this.srcImg = new Image();
                this.srcImg.src = imagesPath + img.src;
                this.img = document.createElement("canvas");
                this.canvas = true;
                scr.appendChild(this.img);
            } else {
                /* ---- normal image ---- */
                this.img = document.createElement('img');
                this.img.src = imagesPath + img.src;
                scr.appendChild(this.img);
            }
            /* ---- on click event ---- */
            this.img.onclick = function () {
                if (camera.s) return;
                if (this.diapo.isLoaded) {
                    if (this.diapo.urlActive) {
                        /* ---- jump hyperlink ---- */
                        top.location.href = this.diapo.url;
                    } else {
                        /* ---- target positions ---- */
                        camera.tz = this.diapo.z - camera.fov;
                        camera.tx = this.diapo.x;
                        camera.ty = this.diapo.y;
                        /* ---- disable previously selected img ---- */
                        if (selected) {
                            selected.but.className = "button viewed";
                            selected.img.className = "";
                            selected.img.style.cursor = "pointer";
                            selected.urlActive = false;
                            urlInfo.style.visibility = "hidden";
                        }
                        /* ---- select current img ---- */
                        this.diapo.but.className = "button selected";
                        interpolation(false);
                        selected = this.diapo;
                    }
                }
            }
            /* ---- command bar buttons ---- */
            this.but = document.createElement('div');
            this.but.className = "button";
            bar.appendChild(this.but);
            this.but.diapo = this;
            this.but.style.left = Math.round((this.but.offsetWidth  * 1.2) * (n % 4)) + 'px';
            this.but.style.top  = Math.round((this.but.offsetHeight * 1.2) * Math.floor(n / 4)) + 'px';
            this.but.onclick = this.img.onclick;
            imb = this.img;
            this.img.diapo = this;
            this.zi = 25000;
        } else {
            /* ---- transparent div ---- */
            this.img = document.createElement('div');
            this.isLoaded = true;
            this.img.className = "fog";
            scr.appendChild(this.img);
            this.w = 300;
            this.h = 300;
            this.zi = 15000;
        }
        /* ---- object variables ---- */
        this.x = x;
        this.y = y;
        this.z = z;
        this.css = this.img.style;
    }
    /* ==== main 3D animation ==== */
    Diapo.prototype.anim = function () {
        if (this.isLoaded) {
            /* ---- 3D to 2D projection ---- */
            var x = this.x - camera.x;
            var y = this.y - camera.y;
            var z = this.z - camera.z;
            if (z < 20) z += 5000;
            var p = camera.fov / z;
            var w = this.w * p;
            var h = this.h * p;
            /* ---- HTML rendering ---- */
            this.css.left   = Math.round(nw + x * p - w * .5) + 'px';
            this.css.top    = Math.round(nh + y * p - h * .5) + 'px';
            this.css.width  = Math.round(w) + 'px';
            this.css.height = Math.round(h) + 'px';
            this.css.zIndex = this.zi - Math.round(z);
        } else {
            /* ---- image is loaded? ---- */
            this.isLoaded = this.loading();
        }
    }
    /* ==== onload initialization ==== */
    Diapo.prototype.loading = function () {
        if ((this.canvas && this.srcImg.complete) || this.img.complete) {
            if (this.canvas) {
                /* ---- canvas version ---- */
                this.w = this.srcImg.width;
                this.h = this.srcImg.height;
                this.img.width = this.w;
                this.img.height = this.h;
                var context = this.img.getContext("2d");
                context.drawImage(this.srcImg, 0, 0, this.w, this.h);
            } else {
                /* ---- plain image version ---- */
                this.w = this.img.width;
                this.h = this.img.height;
            }
            /* ---- button loaded ---- */
            this.but.className += " loaded";
            return true;
        }
        return false;
    }
    ////////////////////////////////////////////////////////////////////////////
    /* ==== screen dimensions ==== */
    var resize = function () {
        nw = scr.offsetWidth * .5;
        nh = scr.offsetHeight * .5;
    }
    /* ==== disable interpolation during animation ==== */
    var interpolation = function (bicubic) {
        var i = 0, o;
        while( o = diapo[i++] ) {
            if (o.but) {
                o.css.msInterpolationMode = bicubic ? 'bicubic' : 'nearest-neighbor'; // makes IE8 happy
                o.css.imageRendering = bicubic ? 'optimizeQuality' : 'optimizeSpeed'; // does not really work...
            }
        }
    }
    /* ==== init script ==== */
    var init = function (data) {
        /* ---- containers ---- */
        scr = document.getElementById("screen");
        bar = document.getElementById("bar");
        urlInfo = document.getElementById("urlInfo");
        resize();
        /* ---- loading images ---- */
        var i = 0,
            o,
            n = data.length;
        while( o = data[i++] ) {
            /* ---- images ---- */
            var x = 1000 * ((i % 4) - 1.5);
            var y = Math.round(Math.random() * 4000) - 2000;
            var z = i * (5000 / n);
            diapo.push( new Diapo(i - 1, o, x, y, z));
            /* ---- transparent frames ---- */
            var k = diapo.length - 1;
            for (var j = 0; j < 3; j++) {
                var x = Math.round(Math.random() * 4000) - 2000;
                var y = Math.round(Math.random() * 4000) - 2000;
                diapo.push( new Diapo(k, null, x, y, z + 100));
            }
        }
        /* ---- start engine ---- */
        run();
    }
    ////////////////////////////////////////////////////////////////////////////
    /* ==== main loop ==== */
    var run = function () {
        /* ---- x axis move ---- */
        if (camera.tx) {
            if (!camera.s) camera.setTarget(camera.x, camera.tx);
            var m = camera.tween('x');
            if (!m) camera.tx = 0;
            /* ---- y axis move ---- */
        } else if (camera.ty) {
            if (!camera.s) camera.setTarget(camera.y, camera.ty);
            var m = camera.tween('y');
            if (!m) camera.ty = 0;
            /* ---- z axis move ---- */
        } else if (camera.tz) {
            if (!camera.s) camera.setTarget(camera.z, camera.tz);
            var m = camera.tween('z');
            if (!m) {
                /* ---- animation end ---- */
                camera.tz = 0;
                interpolation(true);
                /* ---- activate hyperlink ---- */
                if (selected.url) {
                    selected.img.style.cursor = "pointer";
                    selected.urlActive = true;
                    selected.img.className = "href";
                    urlInfo.diapo = selected;
                    urlInfo.onclick = selected.img.onclick;
                    urlInfo.innerHTML = selected.title || selected.url;
                    urlInfo.style.visibility = "visible";
                    urlInfo.style.color = selected.color || "#fff";
                    urlInfo.style.top = Math.round(selected.img.offsetTop + selected.img.offsetHeight - urlInfo.offsetHeight - 5) + "px";
                    urlInfo.style.left = Math.round(selected.img.offsetLeft + selected.img.offsetWidth - urlInfo.offsetWidth - 5) + "px";
                } else {
                    selected.img.style.cursor = "default";
                }
            }
        }
        /* ---- anim images ---- */
        var i = 0, o;
        while( o = diapo[i++] ) o.anim();
        /* ---- loop ---- */
        setTimeout(run, 32);
    }
    return {
        ////////////////////////////////////////////////////////////////////////////
        /* ==== initialize script ==== */
        init : init
    }
}();


/* ==== start script ==== */
setTimeout(function() {
    m3D.init(
        [
            { src: 'album/C360_2013-12-07-14-46-51-977.jpg', url: '#', title: 'this picture have a title.', color: '#fff' },
            { src: 'album/C360_2013-12-07-15-51-48-035.jpg' },
            { src: 'album/C360_2013-12-07-16-06-48-209.jpg' },
            { src: 'album/C360_2013-12-08-23-59-22-215.jpg' },
            { src: 'album/C360_2013-12-09-00-00-20-777.jpg' },
            { src: 'album/C360_2013-12-09-00-03-50-616.jpg' },
            { src: 'album/C360_2013-12-09-00-03-50-616-1.jpg' },
            { src: 'album/C360_2013-12-09-09-41-33-968 (1).jpg' },
            { src: 'album/C360_2013-12-09-09-41-33-968.jpg' },
            { src: 'album/C360_2014-01-31-10-35-58-293.jpg' },
            { src: 'album/C360_2014-02-05-18-28-41-592.jpg' },
            { src: 'album/IMG20141103185135.jpg' },
            { src: 'album/IMG20141215233220.jpg' },
            { src: 'album/IMG20150121193958.jpg' },
            { src: 'album/IMG_20130524_223342.jpg' },
            { src: 'album/IMG_20130605_212201.jpg' },
            { src: 'album/IMG_20130722_071819.jpg' },
            { src: 'album/IMG_20130722_071853.jpg' },
            { src: 'album/IMG_20130722_072049.jpg' },
            { src: 'album/PIC_20140927_210530_C4A.jpg' },
            { src: 'album/PIC_20140928_103753_F53.jpg' },
            { src: 'album/PIC_20140928_103827_A21.jpg' },
            { src: 'album/PIC_20140928_104529_C2F.jpg' },
            { src: 'album/PIC_20140928_105230_A01.jpg' },
            { src: 'album/PIC_20140928_125118_109.jpg' },
            { src: 'album/PIC_20141004_185900_F81.jpg' },
            { src: 'album/PIC_20141004_185930_510.jpg' },
            { src: 'album/PIC_20141004_195254_B8D.jpg' },
            { src: 'album/PIC_20141006_102644_FB3.jpg' },
            { src: 'album/PIC_20141006_103919_8B2.jpg' },
            { src: 'album/PIC_20141006_104048_E96.jpg' },
            { src: 'album/PIC_20141006_105534_257.jpg' },
            { src: 'album/PIC_20141006_140139_3A9.jpg' },
            { src: 'album/PIC_20141006_140233_D79.jpg' },
            { src: 'album/PIC_20141006_142307_DB6.jpg' },
            { src: 'album/PIC_20141006_152156_88B.jpg' },
            { src: 'album/PIC_20141006_152210_135.jpg' },
            { src: 'album/PIC_20141006_152432_F79.jpg' },
            { src: 'album/PIC_20141006_152445_470.jpg' },
            { src: 'album/PIC_20141006_152529_FF0.jpg' },
            { src: 'album/PIC_20141006_152624_80F.jpg' },
            { src: 'album/PIC_20141006_152627_FD4.jpg' },
            { src: 'album/PIC_20141006_152646_F6B.jpg' },
            { src: 'album/PIC_20141013_095658_03F.jpeg' },
            { src: 'album/PIC_20141019_134442_D12.jpg' },
            { src: 'album/PIC_20141023_083634_FA6.jpg' },
            { src: 'album/PIC_20141101_122840_3C1.jpg' },
            { src: 'album/PIC_20141101_125040_ADB.jpg' },
            { src: 'album/PIC_20141103_185013_BF2.jpg' },
            { src: 'album/PIC_20141103_185115_0E1.jpg' },
            { src: 'album/PIC_20141103_185452_8C1.jpg' },
            { src: 'album/PIC_20141103_185503_845.jpg' },
            { src: 'album/PIC_20141103_185537_C0D.jpg' },
            { src: 'album/PIC_20141104_210521_A8A.jpg' },
            { src: 'album/PIC_20141104_210605_073.jpg' },
            { src: 'album/PIC_20141104_210629_ABD.jpg' },
            { src: 'album/PIC_20141104_210649_D6A.jpg' },
            { src: 'album/PIC_20141104_211458_035.jpg' },
            { src: 'album/PIC_20141104_211546_5AD.jpg' },
            { src: 'album/PIC_20141115_175958_000.jpg' },
            { src: 'album/PIC_20141130_133616_55A.jpg' },
            { src: 'album/0e85d4fe6d.jpg' },
            { src: 'album/7b4cc906b3.jpg' },
            { src: 'album/200ff06c0e.jpg' },
            { src: 'album/69833ed09a.jpg', url: '#', color: '#fff' }
        ]
    );
}, 500);