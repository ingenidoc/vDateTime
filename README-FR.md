# vDateTime


### What is vDateTime ?

vDateTime a été créé à l'origine après avoir remarqué le problème de compatibilité de l'objet `Date` de Javascript.

Ce problème est le suivant:

Lors de la déclaration d'une nouvelle date, la norme décrit les paramètres suivants tels qu'ils sont ordonnés: année, mois, jour, heures, heures, minutes, secondes, millisecondes
- Certains navigateurs (comme Chrome ou Firefox) permettent de déclarer une nouvelle date avec une chaîne.
- Lorsque vous utilisez la méthode standard de déclaration d'une date, les mois sont compris entre 0 (janvier) et 11 (décembre)
- Lorsque vous utilisez la méthode en chaîne de caractère pour déclarer une date, les mois vont du 1er janvier au 12 décembre.

*En plus de cela, certaines méthodes ne sont pas vraiment explicites, comme la différence entre `Date.prototype.getYear` et `Date.prototype.getFullYear`.*


Ce sont les raisons concernant la motivation de créer un overlay pour Javascript's Date.

### How to use it ?

Pour les exemples qui suivent, nous assumerons que vDateTime est importé de cette façon :
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
    *  @param {string} Chaîne de date formatée comme n'importe quelle chaîne locale de date
    */
    DateTime (date_string);
```

##### <a name="object-syntax"></a>Syntaxe objet

En raison de résultats imprécis en fonction du format passé à la syntaxe d'instanciation des chaînes de date, il est maintenant recommandé d'utiliser cette syntaxe lorsqu'elle est instanciée avec une chaîne :
```javascript
    /**(JSDOC)
    * DateTime constructor
    * @param
    */
    DateTime(date_object);
    /* 
    où date_object a le format suivant :
    date_object = {
        value: une chaîne de dates,
        format: 'Y-m-d H:i:s'
    }
    */
```

Remarque: la clé de format est facultative si l'option de configuration 'useConfigFormats'est définie sur true et si un format existe dans les formats de configuration pour la locale détectée/passée.

- Délimiteurs acceptés pour le format syntaxique de l'objet:' -','','',':','."," / "/".

- Identificateurs reconnus pour le format (sensible à la casse)

   - 'Y': Identifie l'année
   - 'm': Identifie le mois (dans 1 - 12)
   - 'd': Identifie le jour (dans 1 - 31)
   - 'H': Identifie les heures
   - 'i: Identifie les minutes
   - 's': Identifie les secondes
   - 'u': Identifie les millisecondes
    
- Exemple:

    ```javascript
    new DateTime({
      value: '06-19/2017 09.04:46',
      format: 'm-d/Y s.H:i'
    })
    // Cet exemple est certes une date bizarre, mais il montre la force de cette syntaxe
    ```


##### <a name="getters"></a>Accesseurs
Tous les accesseurs écrits en tant que `DateTime.prototype.<nomMethode>` doivent être appelés sur une instance de DateTime, et les méthodes qui utilisent locale dépendent de la locale détectée du navigateur à l'instanciation de DateTime.
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
     * @return {string} différence de temps entre maintenant et le DateTime
     */
    DateTime.prototype.ago();
```


##### <a name="setters"></a>Mutateurs
Tous les mutateurs écrits en tant que `DateTime.prototype.<nomMethode>` doivent être appelés sur une instance de DateTime, et les méthodes qui utilisent la locale dépendent de la locale détectée du navigateur à l'instanciation de DateTime.
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

##### <a name="symbols"></a>Symboles
Les symboles sont une fonctionnalité ES6 qui ajoute un comportement implicite aux objets. De cette façon, on peut imaginer avoir un comportement qui diffère de la façon dont il est utilisé.

```javascript
    /** L'utilisation d'une instance vDateTime dans un contexte mathématique utilisera l'horodatage de la date. */
    let diff = myDateTime - myOtherDateTime; // => Vous donnera la différence de temps en millisecondes entre les deux dates.
    
    /** Utiliser une instance vDateTime dans un contexte textuel utilisera la sortie de l'accesseur `toString` (utilise la locale) */
    let text = "Today is " + myDateTime; // => "Today is 4/27/2017, 3:21:45 PM"
    let othertext = `Dates selected are ${myDateTime} and ${myOtherDateTime}`; // => "Dates selected are 4/27/2017, 3:21:45 PM and 4/28/2017, 1:10:00 PM"
```


##### <a name="config"></a>Configuration

```javascript
    /**
    * @var {string} locale
    */
    DateTime.config.locale = ""; // Vide par défaut (si une valeur est définie, cette valeur sera utilisée à la place de la détection)
    
    /**
    * @var {boolean} useConfigFormats
    */
    DateTime.config.useConfigFormats = false; // Le paramétrer sur true permettra d'utiliser les formats spécifiés dans la configuration pour les locales
    
    /**
    * @var {boolean} verbose
    */
    DateTime.config.verbose = true; // Si la valeur est définie sur false, tous les avertissements dans la console ne seront pas lancés (cependant les erreurs resteront).
    
    /**
    * @var {Object} translations
    */
    DateTime.config.translations = { // Contient les traductions des méthodes
        ago: { // Contient les traductions de la méthode `DateTime.prototype.ago`.
            'en-US': [] // La clé doit être la locale utilisée, et la valeur un tableau contenant les chaînes de caractères suivantes: 
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
            
            REMARQUE: Les attributs suivants seront utilisés pour analyser les données:
                  - %v La valeur sera remplacée par la valeur (par ex: 'dans %v minutes' =>' dans 3 minutes')
                  - %p {char} Sera utilisé pour déterminer le pluriel d'un mot (p. ex.: 'dans %v minute%p s' => 'dans 3 minutes' => 'dans 1 minute')
             */
        }
    };
    
    DateTime.config.formats = {
        'en-US': 'Y-m-d H:i:s.u' // La clé doit être la locale qui utilisera le format, ce qui signifie que vous pouvez avoir plusieurs formats pour différentes locales.
    }
```