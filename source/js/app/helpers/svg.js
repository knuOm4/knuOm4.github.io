(function() {

    function extend(a, b) {
        for (var key in b) {      if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }

    function SVGButton(el, options) {
        this.el = el;
        this.options = extend({}, this.options);
        extend(this.options, options);
        this.init();
    }

    SVGButton.prototype.options = {
        speed: {
            reset: 800,
            active: 150
        },
        easing: {
            reset: mina.elastic,
            active: mina.easein
        }
    };

    SVGButton.prototype.init = function() {
        this.shapeEl = this.el.querySelector('span.morph-shape');

        var s = Snap(this.shapeEl.querySelector('svg'));
        this.pathEl = s.select('path');
        this.paths = {
            reset: this.pathEl.attr('d'),
            active: this.shapeEl.getAttribute('data-morph-active')
        };

        this.initEvents();
    };

    SVGButton.prototype.initEvents = function() {
        this.el.addEventListener('mousedown', this.down.bind(this));
        this.el.addEventListener('touchstart', this.down.bind(this));

        this.el.addEventListener('mouseup', this.up.bind(this));
        this.el.addEventListener('touchend', this.up.bind(this));

        this.el.addEventListener('mouseout', this.up.bind(this));
    };

    SVGButton.prototype.down = function() {
        this.pathEl.stop().animate({
            'path': this.paths.active
        }, this.options.speed.active, this.options.easing.active);
    };

    SVGButton.prototype.up = function() {
        this.pathEl.stop().animate({
            'path': this.paths.reset
        }, this.options.speed.reset, this.options.easing.reset);
    };

    [].slice.call(document.querySelectorAll('button.button--effect-1')).forEach(function(el) {
        new SVGButton(el);
    });

    [].slice.call(document.querySelectorAll('button.button--effect-2')).forEach(function(el) {
        new SVGButton(el, {
            speed: {
                reset: 650,
                active: 650
            },
            easing: {
                reset: mina.elastic,
                active: mina.elastic
            }
        });
    });
})();

function findNext(num) {
    var a = $("#s" + (num + 1));
    return (a && !a.hasClass("absent")) ? a : findNext(num + 1);
}

function moveTo(num) {
    var cur = $("#s" + num),
        next = findNext(num),
        m;
    console.log(cur, next);
    if (cur.isOnScreen()) {
        m = next;
    } else {
        m = cur
    }
    $("#pt-index").animate({
        scrollTop: m.offset().top
    }, 2000);
};
function changeOut(str) {
    $("#outI").attr("src", str);
};
$.fn.isOnScreen = function() {

    var win = $(window);

    var viewport = {
        top: win.scrollTop(),
        left: win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
};
(function() {
    // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
    if (!String.prototype.trim) {
        (function() {
            // Make sure we trim BOM and NBSP
            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            String.prototype.trim = function() {
                return this.replace(rtrim, '');
            };
        })();
    }

    [].slice.call(document.querySelectorAll('input.input__field')).forEach(function(inputEl) {
        // in case the input is already filled..
        if (inputEl.value.trim() !== '') {
            classie.add(inputEl.parentNode, 'input--filled');
        }

        // events:
        inputEl.addEventListener('focus', onInputFocus);
        inputEl.addEventListener('blur', onInputBlur);
    });

    function onInputFocus(ev) {
        classie.add(ev.target.parentNode, 'input--filled');
    }

    function onInputBlur(ev) {
        if (ev.target.value.trim() === '') {
            classie.remove(ev.target.parentNode, 'input--filled');
        }
    }
})();