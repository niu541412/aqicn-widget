// js/date-tools.js

/**
 * 显示完整格式日期，如："2025年6月27日 星期五 上午11:32:10"
 * @param {number|string|Date} date
 * @param {string} locale
 * @returns {string}
 */
function formatFullDate(date, locale = 'en-US', full = true) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };
    if (full) {
        options.weekday = 'long';
    }
    return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

/**
 * 返回短星期，如 "周五"
 * @param {number|string|Date} date
 * @param {string} locale
 * @returns {string}
 */
function formatShortWeekday(date, locale = 'zh-CN') {
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(date));
}

/**
 * 格式化为 YMD，如 20250627
 * @param {number|string|Date} date
 * @returns {string}
 */
function formatYMD(date) {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}${m}${day}`;
}

/**
 * 返回12小时制小时+AM/PM，如 "5PM"
 * @param {number|string|Date} date
 * @returns {string}
 */
function getHour12AMPM(date) {
    const d = new Date(date);
    let h = d.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}${ampm}`;
}