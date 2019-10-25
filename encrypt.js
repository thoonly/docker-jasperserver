function setMaxDigits(i) {
    maxDigits = i, ZERO_ARRAY = new Array(maxDigits);
    for (var t = 0; t < ZERO_ARRAY.length; t++) ZERO_ARRAY[t] = 0;
    bigZero = new BigInt, bigOne = new BigInt, bigOne.digits[0] = 1
}

function BigInt(i) {
    this.digits = "boolean" == typeof i && 1 == i ? null : ZERO_ARRAY.slice(0), this.isNeg = !1
}

function biFromDecimal(i) {
    for (var t, e = "-" == i.charAt(0), r = e ? 1 : 0; r < i.length && "0" == i.charAt(r);) ++r;
    if (r == i.length) t = new BigInt; else {
        var n = i.length - r, o = n % dpl10;
        for (0 == o && (o = dpl10), t = biFromNumber(Number(i.substr(r, o))), r += o; r < i.length;) t = biAdd(biMultiply(t, biFromNumber(1e15)), biFromNumber(Number(i.substr(r, dpl10)))), r += dpl10;
        t.isNeg = e
    }
    return t
}

function biCopy(i) {
    var t = new BigInt(!0);
    return t.digits = i.digits.slice(0), t.isNeg = i.isNeg, t
}

function biFromNumber(i) {
    var t = new BigInt;
    t.isNeg = i < 0, i = Math.abs(i);
    for (var e = 0; i > 0;) t.digits[e++] = i & maxDigitVal, i >>= biRadixBits;
    return t
}

function reverseStr(i) {
    for (var t = "", e = i.length - 1; e > -1; --e) t += i.charAt(e);
    return t
}

function biToString(i, t) {
    var e = new BigInt;
    e.digits[0] = t;
    for (var r = biDivideModulo(i, e), n = hexatrigesimalToChar[r[1].digits[0]]; 1 == biCompare(r[0], bigZero);) r = biDivideModulo(r[0], e), digit = r[1].digits[0], n += hexatrigesimalToChar[r[1].digits[0]];
    return (i.isNeg ? "-" : "") + reverseStr(n)
}

function biToDecimal(i) {
    var t = new BigInt;
    t.digits[0] = 10;
    for (var e = biDivideModulo(i, t), r = String(e[1].digits[0]); 1 == biCompare(e[0], bigZero);) e = biDivideModulo(e[0], t), r += String(e[1].digits[0]);
    return (i.isNeg ? "-" : "") + reverseStr(r)
}

function digitToHex(t) {
    var e = "";
    for (i = 0; i < 4; ++i) e += hexToChar[15 & t], t >>>= 4;
    return reverseStr(e)
}

function biToHex(i) {
    for (var t = "", e = (biHighIndex(i), biHighIndex(i)); e > -1; --e) t += digitToHex(i.digits[e]);
    return t
}

function charToHex(i) {
    return i >= 48 && i <= 57 ? i - 48 : i >= 65 && i <= 90 ? 10 + i - 65 : i >= 97 && i <= 122 ? 10 + i - 97 : 0
}

function hexToDigit(i) {
    for (var t = 0, e = Math.min(i.length, 4), r = 0; r < e; ++r) t <<= 4, t |= charToHex(i.charCodeAt(r));
    return t
}

function biFromHex(i) {
    for (var t = new BigInt, e = i.length, r = e, n = 0; r > 0; r -= 4, ++n) t.digits[n] = hexToDigit(i.substr(Math.max(r - 4, 0), Math.min(r, 4)));
    return t
}

function biFromString(i, t) {
    var e = "-" == i.charAt(0), r = e ? 1 : 0, n = new BigInt, o = new BigInt;
    o.digits[0] = 1;
    for (var s = i.length - 1; s >= r; s--) {
        n = biAdd(n, biMultiplyDigit(o, charToHex(i.charCodeAt(s)))), o = biMultiplyDigit(o, t)
    }
    return n.isNeg = e, n
}

function biDump(i) {
    return (i.isNeg ? "-" : "") + i.digits.join(" ")
}

function biAdd(i, t) {
    var e;
    if (i.isNeg != t.isNeg) t.isNeg = !t.isNeg, e = biSubtract(i, t), t.isNeg = !t.isNeg; else {
        e = new BigInt;
        for (var r, n = 0, o = 0; o < i.digits.length; ++o) r = i.digits[o] + t.digits[o] + n, e.digits[o] = 65535 & r, n = Number(r >= biRadix);
        e.isNeg = i.isNeg
    }
    return e
}

function biSubtract(i, t) {
    var e;
    if (i.isNeg != t.isNeg) t.isNeg = !t.isNeg, e = biAdd(i, t), t.isNeg = !t.isNeg; else {
        e = new BigInt;
        var r, n;
        n = 0;
        for (var o = 0; o < i.digits.length; ++o) r = i.digits[o] - t.digits[o] + n, e.digits[o] = 65535 & r, e.digits[o] < 0 && (e.digits[o] += biRadix), n = 0 - Number(r < 0);
        if (-1 == n) {
            n = 0;
            for (var o = 0; o < i.digits.length; ++o) r = 0 - e.digits[o] + n, e.digits[o] = 65535 & r, e.digits[o] < 0 && (e.digits[o] += biRadix), n = 0 - Number(r < 0);
            e.isNeg = !i.isNeg
        } else e.isNeg = i.isNeg
    }
    return e
}

function biHighIndex(i) {
    for (var t = i.digits.length - 1; t > 0 && 0 == i.digits[t];) --t;
    return t
}

function biNumBits(i) {
    var t, e = biHighIndex(i), r = i.digits[e], n = (e + 1) * bitsPerDigit;
    for (t = n; t > n - bitsPerDigit && 0 == (32768 & r); --t) r <<= 1;
    return t
}

function biMultiply(i, t) {
    for (var e, r, n, o = new BigInt, s = biHighIndex(i), g = biHighIndex(t), a = 0; a <= g; ++a) {
        for (e = 0, n = a, j = 0; j <= s; ++j, ++n) r = o.digits[n] + i.digits[j] * t.digits[a] + e, o.digits[n] = r & maxDigitVal, e = r >>> biRadixBits;
        o.digits[a + s + 1] = e
    }
    return o.isNeg = i.isNeg != t.isNeg, o
}

function biMultiplyDigit(i, t) {
    var e, r, n, o = new BigInt;
    e = biHighIndex(i), r = 0;
    for (var s = 0; s <= e; ++s) n = o.digits[s] + i.digits[s] * t + r, o.digits[s] = n & maxDigitVal, r = n >>> biRadixBits;
    return o.digits[1 + e] = r, o
}

function arrayCopy(i, t, e, r, n) {
    for (var o = Math.min(t + n, i.length), s = t, g = r; s < o; ++s, ++g) e[g] = i[s]
}

function biShiftLeft(i, t) {
    var e = Math.floor(t / bitsPerDigit), r = new BigInt;
    arrayCopy(i.digits, 0, r.digits, e, r.digits.length - e);
    for (var n = t % bitsPerDigit, o = bitsPerDigit - n, s = r.digits.length - 1, g = s - 1; s > 0; --s, --g) r.digits[s] = r.digits[s] << n & maxDigitVal | (r.digits[g] & highBitMasks[n]) >>> o;
    return r.digits[0] = r.digits[s] << n & maxDigitVal, r.isNeg = i.isNeg, r
}

function biShiftRight(i, t) {
    var e = Math.floor(t / bitsPerDigit), r = new BigInt;
    arrayCopy(i.digits, e, r.digits, 0, i.digits.length - e);
    for (var n = t % bitsPerDigit, o = bitsPerDigit - n, s = 0, g = s + 1; s < r.digits.length - 1; ++s, ++g) r.digits[s] = r.digits[s] >>> n | (r.digits[g] & lowBitMasks[n]) << o;
    return r.digits[r.digits.length - 1] >>>= n, r.isNeg = i.isNeg, r
}

function biMultiplyByRadixPower(i, t) {
    var e = new BigInt;
    return arrayCopy(i.digits, 0, e.digits, t, e.digits.length - t), e
}

function biDivideByRadixPower(i, t) {
    var e = new BigInt;
    return arrayCopy(i.digits, t, e.digits, 0, e.digits.length - t), e
}

function biModuloByRadixPower(i, t) {
    var e = new BigInt;
    return arrayCopy(i.digits, 0, e.digits, 0, t), e
}

function biCompare(i, t) {
    if (i.isNeg != t.isNeg) return 1 - 2 * Number(i.isNeg);
    for (var e = i.digits.length - 1; e >= 0; --e) if (i.digits[e] != t.digits[e]) return i.isNeg ? 1 - 2 * Number(i.digits[e] > t.digits[e]) : 1 - 2 * Number(i.digits[e] < t.digits[e]);
    return 0
}

function biDivideModulo(i, t) {
    var e, r, n = biNumBits(i), o = biNumBits(t), s = t.isNeg;
    if (n < o) return i.isNeg ? (e = biCopy(bigOne), e.isNeg = !t.isNeg, i.isNeg = !1, t.isNeg = !1, r = biSubtract(t, i), i.isNeg = !0, t.isNeg = s) : (e = new BigInt, r = biCopy(i)), new Array(e, r);
    e = new BigInt, r = i;
    for (var g = Math.ceil(o / bitsPerDigit) - 1, a = 0; t.digits[g] < biHalfRadix;) t = biShiftLeft(t, 1), ++a, ++o, g = Math.ceil(o / bitsPerDigit) - 1;
    r = biShiftLeft(r, a), n += a;
    for (var d = Math.ceil(n / bitsPerDigit) - 1, u = biMultiplyByRadixPower(t, d - g); -1 != biCompare(r, u);) ++e.digits[d - g], r = biSubtract(r, u);
    for (var b = d; b > g; --b) {
        var l = b >= r.digits.length ? 0 : r.digits[b], c = b - 1 >= r.digits.length ? 0 : r.digits[b - 1],
            h = b - 2 >= r.digits.length ? 0 : r.digits[b - 2], f = g >= t.digits.length ? 0 : t.digits[g],
            p = g - 1 >= t.digits.length ? 0 : t.digits[g - 1];
        e.digits[b - g - 1] = l == f ? maxDigitVal : Math.floor((l * biRadix + c) / f);
        for (var y = e.digits[b - g - 1] * (f * biRadix + p), m = l * biRadixSquared + (c * biRadix + h); y > m;) --e.digits[b - g - 1], y = e.digits[b - g - 1] * (f * biRadix | p), m = l * biRadix * biRadix + (c * biRadix + h);
        u = biMultiplyByRadixPower(t, b - g - 1), r = biSubtract(r, biMultiplyDigit(u, e.digits[b - g - 1])), r.isNeg && (r = biAdd(r, u), --e.digits[b - g - 1])
    }
    return r = biShiftRight(r, a), e.isNeg = i.isNeg != s, i.isNeg && (e = s ? biAdd(e, bigOne) : biSubtract(e, bigOne), t = biShiftRight(t, a), r = biSubtract(t, r)), 0 == r.digits[0] && 0 == biHighIndex(r) && (r.isNeg = !1), new Array(e, r)
}

function biDivide(i, t) {
    return biDivideModulo(i, t)[0]
}

function biModulo(i, t) {
    return biDivideModulo(i, t)[1]
}

function biMultiplyMod(i, t, e) {
    return biModulo(biMultiply(i, t), e)
}

function biPow(i, t) {
    for (var e = bigOne, r = i; ;) {
        if (0 != (1 & t) && (e = biMultiply(e, r)), 0 == (t >>= 1)) break;
        r = biMultiply(r, r)
    }
    return e
}

function biPowMod(i, t, e) {
    for (var r = bigOne, n = i, o = t; ;) {
        if (0 != (1 & o.digits[0]) && (r = biMultiplyMod(r, n, e)), o = biShiftRight(o, 1), 0 == o.digits[0] && 0 == biHighIndex(o)) break;
        n = biMultiplyMod(n, n, e)
    }
    return r
}

function BarrettMu(i) {
    this.modulus = biCopy(i), this.k = biHighIndex(this.modulus) + 1;
    var t = new BigInt;
    t.digits[2 * this.k] = 1, this.mu = biDivide(t, this.modulus), this.bkplus1 = new BigInt, this.bkplus1.digits[this.k + 1] = 1, this.modulo = BarrettMu_modulo, this.multiplyMod = BarrettMu_multiplyMod, this.powMod = BarrettMu_powMod
}

function BarrettMu_modulo(i) {
    var t = biDivideByRadixPower(i, this.k - 1), e = biMultiply(t, this.mu), r = biDivideByRadixPower(e, this.k + 1),
        n = biModuloByRadixPower(i, this.k + 1), o = biMultiply(r, this.modulus),
        s = biModuloByRadixPower(o, this.k + 1), g = biSubtract(n, s);
    g.isNeg && (g = biAdd(g, this.bkplus1));
    for (var a = biCompare(g, this.modulus) >= 0; a;) g = biSubtract(g, this.modulus), a = biCompare(g, this.modulus) >= 0;
    return g
}

function BarrettMu_multiplyMod(i, t) {
    var e = biMultiply(i, t);
    return this.modulo(e)
}

function BarrettMu_powMod(i, t) {
    var e = new BigInt;
    for (e.digits[0] = 1; ;) {
        if (0 != (1 & t.digits[0]) && (e = this.multiplyMod(e, i)), t = biShiftRight(t, 1), 0 == t.digits[0] && 0 == biHighIndex(t)) break;
        i = this.multiplyMod(i, i)
    }
    return e
}

!function (i) {
    i.jCryption = function (t, e) {
        var r = this;
        r.$el = i(t), r.el = t, r.$el.data("jCryption", r), r.init = function () {
            if (r.options = i.extend({}, i.jCryption.defaultOptions, e), $encryptedElement = i("<input />", {
                type: "hidden",
                name: r.options.postVariable
            }), !1 !== r.options.submitElement) var t = r.options.submitElement; else var t = r.$el.find(":input:submit");
            t.bind(r.options.submitEvent, function () {
                return i(this).attr("disabled", !0), r.options.beforeEncryption() && i.jCryption.getKeys(r.options.getKeysURL, function (t) {
                    i.jCryption.encrypt(r.$el.serialize(), t, function (t) {
                        $encryptedElement.val(t), i(r.$el).find(r.options.formFieldSelector).attr("disabled", !0).end().append($encryptedElement).submit()
                    })
                }), !1
            })
        }, r.init()
    }, i.jCryption.getKeys = function (t, e) {
        var r = function (i, t, e) {
            setMaxDigits(parseInt(e, 10)), this.e = biFromHex(i), this.m = biFromHex(t), this.chunkSize = 2 * biHighIndex(this.m), this.radix = 16, this.barrett = new BarrettMu(this.m)
        };
        i.getJSON(t, function (t) {
            var n = new r(t.e, t.n, t.maxdigits);
            i.isFunction(e) && e.call(this, n)
        })
    }, i.jCryption.encrypt = function (t, e, r) {
        for (var n = 0, o = 0; o < t.length; o++) n += t.charCodeAt(o);
        var s = "0123456789abcdef", g = "";
        g += s.charAt((240 & n) >> 4) + s.charAt(15 & n);
        for (var a = g + t, d = [], u = 0; u < a.length;) d[u] = a.charCodeAt(u), u++;
        for (; d.length % e.chunkSize != 0;) d[u++] = 0;
        !function (t) {
            function n() {
                s = new BigInt, o = 0;
                for (var d = g; d < g + e.chunkSize; ++o) s.digits[o] = t[d++], s.digits[o] += t[d++] << 8;
                var u = e.barrett.powMod(s, e.e), b = 16 == e.radix ? biToHex(u) : biToString(u, e.radix);
                if (a += b + " ", (g += e.chunkSize) < t.length) setTimeout(n, 1); else {
                    var l = a.substring(0, a.length - 1);
                    if (!i.isFunction(r)) return l;
                    r(l)
                }
            }

            var o, s, g = 0, a = "";
            setTimeout(n, 1)
        }(d)
    }, i.jCryption.defaultOptions = {
        submitElement: !1,
        submitEvent: "click",
        getKeysURL: "main.php?generateKeypair=true",
        beforeEncryption: function () {
            return !0
        },
        postVariable: "jCryption",
        formFieldSelector: ":input"
    }, i.fn.jCryption = function (t) {
        return this.each(function () {
            new i.jCryption(this, t)
        })
    }
}(jQuery);
var biRadixBase = 2, biRadixBits = 16, bitsPerDigit = biRadixBits, biRadix = 65536, biHalfRadix = biRadix >>> 1,
    biRadixSquared = biRadix * biRadix, maxDigitVal = biRadix - 1, maxInteger = 9999999999999998, maxDigits, ZERO_ARRAY,
    bigZero, bigOne, dpl10 = 15,
    highBitMasks = new Array(0, 32768, 49152, 57344, 61440, 63488, 64512, 65024, 65280, 65408, 65472, 65504, 65520, 65528, 65532, 65534, 65535),
    hexatrigesimalToChar = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"),
    hexToChar = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"),
    lowBitMasks = new Array(0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535);
define("jquery.jcryption", ["jquery"], function (i) {
    return function () {
        return i.jQuery
    }
}(this)), define("common/extension/jQueryjCryptionExtensions", ["require", "jquery.jcryption"], function (i) {
    "use strict";
    var t = i("jquery.jcryption");
    return t.jCryption.encryptKeyWithoutRedundancy = function (i, e, r) {
        if ("" === i) return t.isFunction(r) ? void r(i) : i;
        for (var n = 0, o = 0; o < i.length; o++) n += i.charCodeAt(o);
        for (var s = [], g = 0; g < i.length;) s[g] = i.charCodeAt(g), g++;
        for (; s.length % e.chunkSize != 0;) s[g++] = 0;
        !function (i) {
            function n() {
                s = new BigInt, o = 0;
                for (var d = g; d < g + e.chunkSize; ++o) s.digits[o] = i[d++], s.digits[o] += i[d++] << 8;
                var u = e.barrett.powMod(s, e.e), b = 16 == e.radix ? biToHex(u) : biToString(u, e.radix);
                if (a += b + " ", (g += e.chunkSize) < i.length) setTimeout(n, 1); else {
                    var l = a.substring(0, a.length - 1);
                    if (!t.isFunction(r)) return l;
                    r(l)
                }
            }

            var o, s, g = 0, a = "";
            setTimeout(n, 1)
        }(s)
    }, t
}), define("common/util/encrypter", ["require", "common/extension/jQueryjCryptionExtensions"], function (i) {
    "use strict";
    var t = i("common/extension/jQueryjCryptionExtensions"), e = {};
    e.code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", e.encode16BitString = function (i) {
        var t, r, n, o, s, g, a, d, u, b, l, c, h = [], f = "", p = e.code;
        if (l = i, (b = l.length % 2) > 0) for (; b++ < 2;) f += "===", l += "\0";
        for (b = 0; b < l.length; b += 2) t = l.charCodeAt(b), r = l.charCodeAt(b + 1), n = t << 16 | r, o = n >> 26 & 63, s = n >> 20 & 63, g = n >> 14 & 63, a = n >> 8 & 63, d = n >> 2 & 63, u = 3 & n, h[b / 2] = p.charAt(o) + p.charAt(s) + p.charAt(g) + p.charAt(a) + p.charAt(d) + p.charAt(u);
        return c = h.join(""), c = c.slice(0, c.length - f.length) + f
    }, e.decode16BitString = function (i) {
        var t, r, n, o, s, g, a, d, u, b, l, c, h = [], f = e.code;
        c = i;
        for (var p = 0; p < c.length; p += 6) s = f.indexOf(c.charAt(p)), g = f.indexOf(c.charAt(p + 1)), a = f.indexOf(c.charAt(p + 2)), d = f.indexOf(c.charAt(p + 3)), u = f.indexOf(c.charAt(p + 4)), b = f.indexOf(c.charAt(p + 5)), l = s << 26 | g << 20 | a << 14 | d << 8 | u << 2 | 3 & b, t = l >>> 24 & 255, r = l >>> 16 & 255, n = l >>> 8 & 255, o = 255 & l, h[p / 6] = String.fromCharCode(t << 8 | r, n << 8 | o), 64 == d && (h[p / 6] = h[p / 6] = String.fromCharCode(t << 8 | r));
        return h.join("")
    };
    var r = {
        encryptData: function (i, e) {
            if (!i) return void e();
            t.jCryption.getKeys("GetEncryptionKey", function (t) {
                var n = t, o = [];
                for (var s in i) o.push(s);
                var g = {};
                r._encryptDataRecursive(i, o, 0, n, g, e)
            })
        }, _encryptDataRecursive: function (i, e, n, o, s, g) {
            if (e && e.length != n) {
                var a = encodeURIComponent(i[e[n]]), d = a.split("").reverse().join("");
                t.jCryption.encryptKeyWithoutRedundancy(d, o, function (t) {
                    s[e[n]] = t, e.length == n + 1 ? g(s) : r._encryptDataRecursive(i, e, n + 1, o, s, g)
                })
            }
        }
    };
    return r
}), define("encrypt/encryptMain", ["require", "commons.main", "jquery", "underscore", "domReady", "common/util/encrypter"], function (i) {
    "use strict";
    i("commons.main");
    var t = i("jquery"), e = i("underscore"), r = i("domReady"), n = i("common/util/encrypter");
    r(function () {
        var i = t("#text1"), r = t("#text2"), o = function (e) {
            t.trim(i.val()) && (isEncryptionOn && n.encryptData({j_password: i.val()}, function (i) {
                for (var t in i) r.removeAttr("disabled").val(i[t])
            }), e.preventDefault())
        }, s = function (t) {
            i.val(""), r.val(""), t.preventDefault()
        };
        t("#clearButton").click(s), t("#submitButton").click(o), i.keypress(function (i) {
            13 == (i.keyCode || i.which) && e.defer(o, i)
        })
    })
});
