# vDateTime


### What is vDateTime ?

vDateTime was originally created after having noticed the compatibility issue of Javascript's `Date`  object.

This problem is the following:

- When declaring a new `Date`, the Standard describes the following parameters as ordered: year, month, day, hours, minutes, seconds, milliseconds
- Some browsers (as Chrome or Firefox) allow to declare a new `Date` with a String.
- When using the Standard way of declaring a `Date`, months are from 0 (January) to 11 (December)
- When using the String way to declare a `Date`, months are from 1 (January) to 12 (December)

*In addition to that, some methods are not really explicit, such as the difference between `Date.prototype.getYear` and `Date.prototype.getFullYear`*

These are the reasons concerning the motivation of creating an overlay for Javascript's Date.


### How to use it ?

For the examples that follow, we will assume that we required vDateTime this way:
```ecmascript 6
    let DateTime = require('vdatetime');
```

##### <a name="signature"></a>Signature
```javascript
    /**(JSDOC)
    *  DateTime constructor
    *  @param {number|string} year
    *  @param {number|string} month
    *  @param {number|string} day
    *  @param {number|string} hours
    *  @param {number|string} minutes
    *  @param {number|string} seconds
    *  @param {number|string} milliseconds
    *  @return undefined
    */
    DateTime (year, month, day, hours, minutes, seconds, milliseconds);
    
    
    /**
    *  DateTime constructor
    *  @param {string} Date string formatted as any locale date string
    */
    DateTime (date_string);
```

##### <a name="object-syntax"></a>Object Syntax

Due to inaccurate results depending on the format passed to the date string instanciation syntax, it is now recommended to use this syntax when instanciated with a string:
```javascript
    /**(JSDOC)
    * DateTime constructor
    * @param
    */
    DateTime(date_object);
    /* 
    where date_object has the following format:
    date_object = {
        value: some date string,
        format: 'Y-m-d H:i:s'
    }
    */
```

Note: the format key is optional if the config option 'useConfigFormats' is set to true and that a format exists in the config formats for the locale detected/passed

- Accepted delimiters for the object syntax format: '-', ' ', ':', '.', '/'

- Recognized identifiers for the format (case sensitive):

    - 'Y': Identifies the year
    - 'm': Identifies the month (in range 1 - 12)
    - 'd': Identifies the day (in range 1 - 31)
    - 'H': Identifies the hours
    - 'i': Identifies the minutes
    - 's': Identifies the seconds
    - 'u': Identifies the milliseconds
    
- Example:

    ```javascript
    new DateTime({
      value: '06-19/2017 09.04:46',
      format: 'm-d/Y s.H:i'
    })
    // This example sure is a weird date, but it shows the strength of this syntax
    ```


##### <a name="getters"></a>Getters
All getters written as `DateTime.prototype.<methodName>` should be called on an instance of DateTime, and methods that use locale rely on the locale detected of the browser at the instanciation of the DateTime.
```javascript
    /**
     * @return {string}
     */
    DateTime.prototype.toString();
    
    /**
     * @return {string}
     */
    DateTime.prototype.toTime();
    
    /**
     * @return {string}
     */
    DateTime.prototype.toDate();
    
    /**
     * @return {number}
     */
    DateTime.prototype.year();
    
    /**
     * @return {number} Range<1-12>
     */
    DateTime.prototype.month();
    
    /**
     * @return {number} Range<1-31>
     */
    DateTime.prototype.date();
    
    /**
     * @return {number} Range<0-6>
     */
    DateTime.prototype.day();
    
    /**
     * @return {number} Range<0-23>
     */
    DateTime.prototype.hour();
    
    /**
     * @return {number} Range<0-59>
     */
    DateTime.prototype.minutes();
    
    /**
     * @return {number} Range<0-59>
     */
    DateTime.prototype.seconds();
    
    /**
     * @return {number}
     */
    DateTime.prototype.timestamp();
    
    /**
     * @return {string} difference of time between now and the DateTime
     */
    DateTime.prototype.ago();
```


##### <a name="setters"></a>Setters
All setters written as `DateTime.prototype.<methodName>` should be called on an instance of DateTime, and methods that use locale rely on the locale detected of the browser at the instanciation of the DateTime.
```javascript
    /**
     * @param {number} year
     */
    DateTime.prototype.setYear(year);
    
    /**
     * @param {number} month
     */
    DateTime.prototype.setMonth(month);
    
    /**
     * @param {number} date
     */
    DateTime.prototype.setDate(date);
    
    /**
     * @param {number} hours
     * @param {number} minutes
     * @param {number} seconds
     */
    DateTime.prototype.setTime(hours, minutes, seconds);
    
    /**
     * @param {number} hours
     */
    DateTime.prototype.setHours(hours);
    
    /**
     * @param {number} minutes
     */
    DateTime.prototype.setMinutes(minutes);
    
    /**
     * @param {number} seconds
     */
    DateTime.prototype.setSeconds(seconds);
    
    /**
     * @param {number} milliseconds
     */
    DateTime.prototype.setMilliseconds(milliseconds);
    
    /**
     * @param {number} timestamp
     */
    DateTime.prototype.setTimestamp(timestamp);
```

##### <a name="symbols"></a>Symbols
Symbols are an ES6 feature that adds implicit behavior to objects. This way, we can imagine having a behavior that differs from the way it is used.

```javascript
    /** Using a vDateTime instance in a mathematical context will use the timestamp of the date */
    let diff = myDateTime - myOtherDateTime; // => Will give you the difference of time in milliseconds between the two dates
    
    /** Using a vDateTime instance in a textual context will use the output of `toString` (uses locale) getter */
    let text = "Today is " + myDateTime; // => "Today is 4/27/2017, 3:21:45 PM"
    let othertext = `Dates selected are ${myDateTime} and ${myOtherDateTime}`; // => "Dates selected are 4/27/2017, 3:21:45 PM and 4/28/2017, 1:10:00 PM"
```


##### <a name="config"></a>Config

```javascript
    /**
    * @var {string} locale
    */
    DateTime.config.locale = ""; // Default false (if a value is set up this value will be used instead of detection)
    
    /**
    * @var {boolean} useConfigFormats
    */
    DateTime.config.useConfigFormats = false; // Setting it to true will allow using the formats specified in the config for the locales
    
    /**
    * @var {boolean} verbose
    */
    DateTime.config.verbose = true; // If the value is set to false, all warnings in the console won't be thrown (still errors will be)
    
    /**
    * @var {Object} translations
    */
    DateTime.config.translations = { // Contains the translations of the methods
        ago: { // Contains the translations of the `DateTime.prototype.ago` method
            'en-US': [] // The key should be the locale used, and the value an array containing the following strings: 
            /* 
            [ 
              'just now',
              'some seconds ago',
              'some minutes ago',
              'some hours ago',
              'some days ago',
              'some months ago',
              'some years ago',
              'in some seconds',
              'in some minutes',
              'in some hours',
              'in some days',
              'in some months',
              'in some years'
            ]
            
            NOTE: The following attributes will be used for parsing data :
              - %v Will be replaced by the value (e.g.: 'in %v minutes' => 'in 3 minutes')
              - %p {char} Will be used to determine the plural of a word (e.g.: 'in %v minute%p s' => 'in 3 minutes' => 'in 1 minute')
             */
        }
    };
    
    DateTime.config.formats = {
        'en-US': 'Y-m-d H:i:s.u' // The key should be the locale that will use the format, meaning that you can have multiple formats for different locales
    }
```