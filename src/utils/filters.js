// 全局过滤器
import Vue from 'vue'
// 数字千分位
Vue.filter('thousands', (num, cent = 2, isThousand = 1) => {
  if (isNaN(num)) return num
  num = num.toString().replace(/\$|,/g, '')

  // 检查传入数值为数值类型
  if (isNaN(num)) num = '0'

  // 获取符号(正/负数)
  const sign = num === (num = Math.abs(num))

  num = Math.floor(num * Math.pow(10, cent) + 0.50000000001) // 把指定的小数位先转换成整数.多余的小数位四舍五入
  let cents = num % Math.pow(10, cent) // 求出小数位数值
  num = Math.floor(num / Math.pow(10, cent)).toString() // 求出整数位数值
  cents = cents.toString() // 把小数位转换成字符串,以便求小数位长度

  // 补足小数位到指定的位数
  while (cents.length < cent) cents = '0' + cents

  if (isThousand) {
    // 对整数部分进行千分位格式化.
    for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
      num =
        num.substring(0, num.length - (4 * i + 3)) +
        ',' +
        num.substring(num.length - (4 * i + 3))
    }
  }
  if (cent > 0) return (sign ? '' : '-') + num + '.' + cents
  else return (sign ? '' : '-') + num
})

// 时间格式化
// undefined => new Date
// Date => new Date(Date)
// number => new Date(number)
Vue.filter('date', function(val, format) {
  function date(format, timestamp) {
    let jsdate
    // Keep this here (works, but for code commented-out below for file size reasons)
    // var tal= [];
    const txtWords = [
      'Sun',
      'Mon',
      'Tues',
      'Wednes',
      'Thurs',
      'Fri',
      'Satur',
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    // trailing backslash -> (dropped)
    // a backslash followed by any character (including backslash) -> the character
    // empty string -> empty string
    const formatChr = /\\?(.?)/gi
    const formatChrCb = function(t, s) {
      return f[t] ? f[t]() : s
    }
    const _pad = function(n, c) {
      n = String(n)
      while (n.length < c) {
        n = '0' + n
      }
      return n
    }
    const f = {
      // Day
      d: function() {
        // Day of month w/leading 0; 01..31
        return _pad(f.j(), 2)
      },
      D: function() {
        // Shorthand day name; Mon...Sun
        return f.l().slice(0, 3)
      },
      j: function() {
        // Day of month; 1..31
        return jsdate.getDate()
      },
      l: function() {
        // Full day name; Monday...Sunday
        return txtWords[f.w()] + 'day'
      },
      N: function() {
        // ISO-8601 day of week; 1[Mon]..7[Sun]
        return f.w() || 7
      },
      S: function() {
        // Ordinal suffix for day of month; st, nd, rd, th
        const j = f.j()
        let i = j % 10
        if (i <= 3 && parseInt((j % 100) / 10, 10) === 1) {
          i = 0
        }
        return ['st', 'nd', 'rd'][i - 1] || 'th'
      },
      w: function() {
        // Day of week; 0[Sun]..6[Sat]
        return jsdate.getDay()
      },
      z: function() {
        // Day of year; 0..365
        const a = new Date(f.Y(), f.n() - 1, f.j())
        const b = new Date(f.Y(), 0, 1)
        return Math.round((a - b) / 864e5)
      },

      // Week
      W: function() {
        // ISO-8601 week number
        const a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3)
        const b = new Date(a.getFullYear(), 0, 4)
        return _pad(1 + Math.round((a - b) / 864e5 / 7), 2)
      },

      // Month
      F: function() {
        // Full month name; January...December
        return txtWords[6 + f.n()]
      },
      m: function() {
        // Month w/leading 0; 01...12
        return _pad(f.n(), 2)
      },
      M: function() {
        // Shorthand month name; Jan...Dec
        return f.F().slice(0, 3)
      },
      n: function() {
        // Month; 1...12
        return jsdate.getMonth() + 1
      },
      t: function() {
        // Days in month; 28...31
        return new Date(f.Y(), f.n(), 0).getDate()
      },

      // Year
      L: function() {
        // Is leap year?; 0 or 1
        const j = f.Y()
        return ((j % 4 === 0) & (j % 100 !== 0)) | (j % 400 === 0)
      },
      o: function() {
        // ISO-8601 year
        const n = f.n()
        const W = f.W()
        const Y = f.Y()
        return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0)
      },
      Y: function() {
        // Full year; e.g. 1980...2010
        return jsdate.getFullYear()
      },
      y: function() {
        // Last two digits of year; 00...99
        return f
          .Y()
          .toString()
          .slice(-2)
      },

      // Time
      a: function() {
        // am or pm
        return jsdate.getHours() > 11 ? 'pm' : 'am'
      },
      A: function() {
        // AM or PM
        return f.a().toUpperCase()
      },
      B: function() {
        // Swatch Internet time; 000..999
        const H = jsdate.getUTCHours() * 36e2
        // Hours
        const i = jsdate.getUTCMinutes() * 60
        // Minutes
        const s = jsdate.getUTCSeconds() // Seconds
        return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3)
      },
      g: function() {
        // 12-Hours; 1..12
        return f.G() % 12 || 12
      },
      G: function() {
        // 24-Hours; 0..23
        return jsdate.getHours()
      },
      h: function() {
        // 12-Hours w/leading 0; 01..12
        return _pad(f.g(), 2)
      },
      H: function() {
        // 24-Hours w/leading 0; 00..23
        return _pad(f.G(), 2)
      },
      i: function() {
        // Minutes w/leading 0; 00..59
        return _pad(jsdate.getMinutes(), 2)
      },
      s: function() {
        // Seconds w/leading 0; 00..59
        return _pad(jsdate.getSeconds(), 2)
      },
      u: function() {
        // Microseconds; 000000-999000
        return _pad(jsdate.getMilliseconds() * 1000, 6)
      },

      // Timezone
      e: function() {
        // Timezone identifier; e.g. Atlantic/Azores, ...
        // The following works, but requires inclusion of the very large
        // timezone_abbreviations_list() function.
        /*              return that.date_default_timezone_get();
         */
        /* eslint-disable */
        console.error(
          'Not supported (see source code of date() for timezone on how to add support'
        )
        /* eslint-enable */
      },
      I: function() {
        // DST observed?; 0 or 1
        // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
        // If they are not equal, then DST is observed.
        const a = new Date(f.Y(), 0)
        // Jan 1
        const c = Date.UTC(f.Y(), 0)
        // Jan 1 UTC
        const b = new Date(f.Y(), 6)
        // Jul 1
        const d = Date.UTC(f.Y(), 6) // Jul 1 UTC
        return a - c !== b - d ? 1 : 0
      },
      O: function() {
        // Difference to GMT in hour format; e.g. +0200
        const tzo = jsdate.getTimezoneOffset()
        const a = Math.abs(tzo)
        return (
          (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + (a % 60), 4)
        )
      },
      P: function() {
        // Difference to GMT w/colon; e.g. +02:00
        const O = f.O()
        return O.substr(0, 3) + ':' + O.substr(3, 2)
      },
      T: function() {
        return 'UTC'
      },
      Z: function() {
        // Timezone offset in seconds (-43200...50400)
        return -jsdate.getTimezoneOffset() * 60
      },

      // Full Date/Time
      c: function() {
        // ISO-8601 date.
        return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb)
      },
      r: function() {
        // RFC 2822
        return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb)
      },
      U: function() {
        // Seconds since UNIX epoch
        return (jsdate / 1000) | 0
      }
    }
    const date = function(timestamp, format) {
      if (!format) format = 'Y-m-d H:i:s'

      if (timestamp == null || timestamp === 0) return ''
      jsdate =
        timestamp === undefined
          ? new Date() // Not provided
          : timestamp instanceof Date
            ? new Date(timestamp) // JS Date()
            : new Date(
              (timestamp >= 10000000000
                ? Math.round(timestamp / 1000)
                : timestamp) * 1000
            ) // UNIX timestamp (auto-convert to int)
      return format.replace(formatChr, formatChrCb)
    }
    return date(format, timestamp)
  }
  return date(val, format)
})
