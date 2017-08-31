

let DateTime = function (...args) {
    
    let year;
    let month;
    let day;
    let hour;
    let minutes;
    let seconds;
    let milliseconds;

    let date = args;

    if (DateTime.config.locale) {
        this.locale = DateTime.config.locale
    }
    else {
        this.locale = global.navigator ? global.navigator.languages[0] : "en-US";
    }

    if (typeof date[0] === 'object' && date[0] instanceof Object) {
        date = date[0];

        if(!date.hasOwnProperty('value')) return void console.error('vDateTime instanciated with Object syntax but the key \'value\' were not found');

        let format;
        if(date.hasOwnProperty('format')) format = date.format.split(/[- :./]/);
        else if(DateTime.config.useConfigFormats) {
            if(DateTime.config.formats[this.locale]) format = DateTime.config.formats[this.locale].split(/[- :./]/);
            else if(DateTime.config.verbose) console.warn("vDateTime: No format is associated to the locale but the config is set to use config formats")
        }
        else return void console.error('vDateTime instanciated with Object syntax but the key \'format\' were not found');

        let dateValues = date.value.split(/[- :./]/);

        let year = dateValues[format.indexOf('Y')] || new Date().getFullYear();
        let month = dateValues[format.indexOf('m')] || new Date().getMonth() +1;
        let day = dateValues[format.indexOf('d')] || new Date().getDate();
        let hours = dateValues[format.indexOf('H')] || new Date().getHours();
        let minutes = dateValues[format.indexOf('i')] || new Date().getMinutes();
        let seconds = dateValues[format.indexOf('s')] || new Date().getSeconds();
        let ms = dateValues[format.indexOf('u')] || new Date().getMilliseconds();

        this._value = new Date(year, month -1, day, hours, minutes, seconds, ms);
    }
    else {
        if (date.length) {

            if (date.length === 1 && !isNaN(Number(date[0])) && new Date(date[0]).toString() !== "Invalid Date") {
                if (new Date(String(date[0])).toString() === "Invalid Date") {
                    this._value = new Date(date[0])
                }
                else {
                    this._value = new Date(String(date[0]))
                }
            }
            else {
                if (typeof date[0] === 'string' && date.length === 1) {
                    if(DateTime.config.verbose) console.warn('vDateTime: String syntax constructor has been used. Depending on the format, some results may vary or be inaccurate. Please consider using the Object syntax if possible (see https://www.npmjs.com/package/vdatetime#object-syntax)');
                    let datestring = date[0];
                    date = datestring.split(/[- :./]/);

                    year = date.filter(function (item) {
                        return item.length === 4
                    })[0];
                    date.splice(date.indexOf(year), 1);
                    month = (date[0].length <= 2 && Number(date[0]) <= 12) ?
                        date[0] :
                        (date[1].length <= 2 && Number(date[1]) <= 12) ?
                            date[1] : 0;
                    date.splice(date.indexOf(month), 1);
                    day = date[0] ? date[0] : 0;
                    hour = date[1] ? date[1] : 0;
                    minutes = date[2] ? date[2] : 0;
                    seconds = date[3] ? date[3] : 0;
                    milliseconds = date[4] ? date[4] : 0;

                    this._value = new Date(year, month - 1, day, hour, minutes, seconds, milliseconds);
                }
                else if (typeof date === 'string' && date === '') {
                    this._value = new Date();
                }
                else {
                    year = date[0] && String(date[0]).length === 4 ? Number(date[0]) : 0;
                    month = date[1] && String(date[1]).length <= 2 ? Number(date[1]) : 0;
                    day = date[2] && String(date[2]).length <= 2 ? Number(date[2]) : 0;
                    hour = date[3] && String(date[3]).length <= 2 ? Number(date[3]) : 0;
                    minutes = date[4] && String(date[4]).length <= 2 ? Number(date[4]) : 0;
                    seconds = date[5] && String(date[5]).length <= 2 ? Number(date[5]) : 0;
                    milliseconds = date[6] && String(date[6]).length <= 6 ? Number(date[6]) : 0;

                    this._value = new Date(year, month - 1, day, hour, minutes, seconds, milliseconds);
                }
            }
        }
        else {
            this._value = new Date();
        }
    }
};

/**
 * Symbols
 */
DateTime.prototype[Symbol.toPrimitive] = function (hint) {
    if(hint === "number") {
        return this.timestamp()
    }
    if(hint === "string") {
        return this.toString()
    }
    return this.timestamp();
};

DateTime.prototype[Symbol.toStringTag] = function () {
    return this.toString()
};
/**
 * End Symbols
 */

/**
 * @return {string}
 */
DateTime.prototype.toString = function () {
    return this._value.toLocaleString(this.locale)
};

/**
 * @return {string}
 */
DateTime.prototype.toTime = function () {
    return this._value.toLocaleTimeString(this.locale)
};

/**
 * @return {string}
 */
DateTime.prototype.toDate = function () {
    return this._value.toLocaleDateString(this.locale)
};

/**
 * @return {number}
 */
DateTime.prototype.year = function () {
    return this._value.getFullYear()
};

/**
 * @return {number} Range<1-12>
 */
DateTime.prototype.month = function () {
    return this._value.getMonth() + 1
};

/**
 * @return {number} Range<1-31>
 */
DateTime.prototype.date = function () {
    return this._value.getDate()
};

/**
 * @return {number} Range<0-6>
 */
DateTime.prototype.day = function () {
    return this._value.getDay()
};

/**
 * @return {number} Range<0-23>
 */
DateTime.prototype.hour = function () {
    return this._value.getHours()
};

/**
 * @return {number} Range<0-59>
 */
DateTime.prototype.minutes = function () {
    return this._value.getMinutes()
};

/**
 * @return {number} Range<0-59>
 */
DateTime.prototype.seconds = function () {
    return this._value.getSeconds()
};

/**
 * @return {number}
 */
DateTime.prototype.timestamp = function () {
    return this._value.valueOf()
};

/**
 * @return {string}
 */
DateTime.prototype.ago = function () {
    try {
        let trans = DateTime.config.translations.ago;
        let future = false;
        let milliseconds = new DateTime() - this.timestamp();
        if(milliseconds < 0) {
            milliseconds = Math.abs(milliseconds);
            future = true;
        }
        let seconds = milliseconds / 1000;
        if (seconds < 1) {
            return trans[this.locale][0];
        }
        let minutes = seconds / 60;
        if (minutes < 1) {
            let txt = future ? trans[this.locale][7]: trans[this.locale][1];
            let reg = (seconds < 2) ? /(%p .)/g: /(%p )/g;
            txt = txt.replace(reg, '');
            return txt.replace(/(%v)/g, round(seconds, 0));
        }
        let hours = minutes / 60;
        if (hours < 1) {
            let txt = future ? trans[this.locale][8]: trans[this.locale][2];
            let reg = (minutes < 2) ? /(%p .)/g: /(%p )/g;
            txt = txt.replace(reg, '');
            return txt.replace(/(%v)/g, round(minutes, 0));
        }
        let days = hours / 24;
        if (days < 1) {
            let txt = future ? trans[this.locale][9]: trans[this.locale][3];
            let reg = (hours < 2) ? /(%p .)/g: /(%p )/g;
            txt = txt.replace(reg, '');
            return txt.replace(/(%v)/g, round(hours, 0));
        }
        let months = days / 30;
        if (months < 1) {
            let txt = future ? trans[this.locale][10]: trans[this.locale][4];
            let reg = (days < 2) ? /(%p .)/g: /(%p )/g;
            txt = txt.replace(reg, '');
            return txt.replace(/(%v)/g, round(days, 0))
        }
        let years = months / 12;
        if (years < 1) {
            let txt = future ? trans[this.locale][11]: trans[this.locale][5];
            let reg = (months < 2) ? /(%p .)/g: /(%p )/g;
            txt = txt.replace(reg, '');
            return txt.replace(/(%v)/g, round(months, 0))
        }
        let txt = future ? trans[this.locale][12]: trans[this.locale][6];
        let reg = (years < 2) ? /(%p .)/g: /(%p )/g;
        txt = txt.replace(reg, '');
        return txt.replace(/(%v)/g, round(years, 0))
    }
    catch (e) {
        if(DateTime.config.verbose) console.warn(
            "No translation found for the `vDateTime.prototype.ago` member method. Please consider the following:" +
            "\n  - Make sure that you don't override the translation" +
            "\n  - Make sure that the translation exists otherwise you should add it to `vDateTime.config.translations.ago` under the key equal to the locale" +
            "\n  - Make sure that all the translations needed are given in the array\n" +
            "(see http://www.npmjs.com/package/vdatetime for more information)" +
            "\n>>>" +
            "\n", e.stack
        );
    }
};

/* Setters */

/**
 * @param {number} year
 */
DateTime.prototype.setYear = function (year) {
    this._value.setFullYear(year)
};

/**
 * @param {number} month
 */
DateTime.prototype.setMonth = function (month) {
    if(typeof month === 'number' && month >= 1 && month <= 12) {
        this._value.setMonth(month - 1)
    }
    else {
        throw new Error("Error at DateTime.prototype.setMonth: parameter is expected to be type of Number and between 1 and 12")
    }
};

/**
 * @param {number} date
 */
DateTime.prototype.setDate = function (date) {
    this._value.setDate(date)
};

/**
 * @param {number} hours
 * @param {number} minutes
 * @param {number} seconds
 */
DateTime.prototype.setTime = function (hours = 0, minutes = 0, seconds = 0) {
    this.setHours(hours);
    this.setMinutes(minutes);
    this.setSeconds(seconds)
};

/**
 * @param {number} hours
 */
DateTime.prototype.setHours = function (hours) {
    this._value.setHours(hours)
};

/**
 * @param {number} minutes
 */
DateTime.prototype.setMinutes = function (minutes) {
    this._value.setMinutes(minutes)
};

/**
 * @param {number} seconds
 */
DateTime.prototype.setSeconds = function (seconds) {
    this._value.setSeconds(seconds)
};

/**
 * @param {number} milliseconds
 */
DateTime.prototype.setMilliseconds = function (milliseconds) {
    this._value.setMilliseconds(milliseconds)
};

/**
 * @param {number} timestamp
 */
DateTime.prototype.setTimestamp = function (timestamp) {
    this._value.setTime(timestamp)
};

let round = function (val, precision) {
    let multiplier = '1';
    for(let i = 0; i < precision; i++){
        multiplier += '0'
    }
    multiplier = Number(multiplier);
    return Math.round(val * multiplier) / multiplier
};


/**
 * Config
 */
DateTime.config = {
    locale: false,
    useConfigFormats: false,
    verbose: true,

    translations: {
        ago: {
            "en-US": [
                "Just now",
                "%v second%p s ago",
                "%v minute%p s ago",
                "%v hour%p s ago",
                "%v day%p s ago",
                "%v month%p s ago",
                "%v year%p s ago",

                "In %v second%p s",
                "In %v minute%p s",
                "In %v hour%p s",
                "In %v day%p s",
                "In %v month%p s",
                "In %v year%p s"
            ],
            "fr-FR": [
                "A l'instant",
                "Il y a %v seconde%p s",
                "Il y a %v minute%p s",
                "Il y a %v heure%p s",
                "Il y a %v jour%p s",
                "Il y a %v mois",
                "Il y a %v an%p s",

                "Dans %v seconde%p s",
                "Dans %v minute%p s",
                "Dans %v heure%p s",
                "Dans %v jour%p s",
                "Dans %v mois",
                "Dans %v an%p s"
            ],
            "de-DE": [
                "zum Zeitpunkt",
                "Vor %v Sekunde%p n",
                "Vor %v Minute%p n",
                "Vor %v Uhr%p s",
                "Vor %v Tag%p e",
                "Vor %v Monat%p e",
                "Vor %v Jahr%p e",

                "In %v Sekunde%p n",
                "In %v Minute%p n",
                "In %v Urh%p s",
                "In %v Tag%p e",
                "In %v Monat%p e",
                "In %v Jahr%p e"
            ]
        }
    },
    formats: {
        'en-US': 'Y-m-d H:i:s.u',
        'fr-FR': 'd/m/Y H:i:s.u'
    }
};


module.exports = DateTime;