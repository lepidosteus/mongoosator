var _ = require('underscore');

module.exports = function slug(schema, options) {
    var settings = {
	source: 'title',
	path: 'slug',
	lowercase: true,
	unique: true,
	replaces: {
	    'ä|æ|ǽ': 'ae',
	    'ö|œ': 'oe',
	    'ü': 'ue',
	    'Ä': 'Ae',
	    'Ü': 'Ue',
	    'Ö': 'Oe',
	    'À|Á|Â|Ã|Ä|Å|Ǻ|Ā|Ă|Ą|Ǎ': 'A',
	    'à|á|â|ã|å|ǻ|ā|ă|ą|ǎ|ª': 'a',
	    'Ç|Ć|Ĉ|Ċ|Č': 'C',
	    'ç|ć|ĉ|ċ|č': 'c',
	    'Ð|Ď|Đ': 'D',
	    'ð|ď|đ': 'd',
	    'È|É|Ê|Ë|Ē|Ĕ|Ė|Ę|Ě': 'E',
	    'è|é|ê|ë|ē|ĕ|ė|ę|ě': 'e',
	    'Ĝ|Ğ|Ġ|Ģ': 'G',
	    'ĝ|ğ|ġ|ģ': 'g',
	    'Ĥ|Ħ': 'H',
	    'ĥ|ħ': 'h',
	    'Ì|Í|Î|Ï|Ĩ|Ī|Ĭ|Ǐ|Į|İ': 'I',
	    'ì|í|î|ï|ĩ|ī|ĭ|ǐ|į|ı': 'i',
	    'Ĵ': 'J',
	    'ĵ': 'j',
	    'Ķ': 'K',
	    'ķ': 'k',
	    'Ĺ|Ļ|Ľ|Ŀ|Ł': 'L',
	    'ĺ|ļ|ľ|ŀ|ł': 'l',
	    'Ñ|Ń|Ņ|Ň': 'N',
	    'ñ|ń|ņ|ň|ŉ': 'n',
	    'Ò|Ó|Ô|Õ|Ō|Ŏ|Ǒ|Ő|Ơ|Ø|Ǿ': 'O',
	    'ò|ó|ô|õ|ō|ŏ|ǒ|ő|ơ|ø|ǿ|º': 'o',
	    'Ŕ|Ŗ|Ř': 'R',
	    'ŕ|ŗ|ř': 'r',
	    'Ś|Ŝ|Ş|Š': 'S',
	    'ś|ŝ|ş|š|ſ': 's',
	    'Ţ|Ť|Ŧ': 'T',
	    'ţ|ť|ŧ': 't',
	    'Ù|Ú|Û|Ũ|Ū|Ŭ|Ů|Ű|Ų|Ư|Ǔ|Ǖ|Ǘ|Ǚ|Ǜ': 'U',
	    'ù|ú|û|ũ|ū|ŭ|ů|ű|ų|ư|ǔ|ǖ|ǘ|ǚ|ǜ': 'u',
	    'Ý|Ÿ|Ŷ': 'Y',
	    'ý|ÿ|ŷ': 'y',
	    'Ŵ': 'W',
	    'ŵ': 'w',
	    'Ź|Ż|Ž': 'Z',
	    'ź|ż|ž': 'z',
	    'Æ|Ǽ': 'AE',
	    'ß': 'ss',
	    'Ĳ': 'IJ',
	    'ĳ': 'ij',
	    'Œ': 'OE',
	    'ƒ': 'f'
	}
    }

    _.extend(settings, options);

    var field = {};
    field[settings.path] = {
	type: String,
        default: ''
    };

    if (settings.lowercase) {
	field[settings.path].lowercase = true;
    }

    schema.add(field);
    
    if (settings.unique) {
	schema.path(settings.path).unique(true);
    }

    schema.pre('save', function(next) {
	var s = this[settings.source];
	for (var i in settings.replaces) {
	    s = s.replace(new RegExp(i, 'g'), settings.replaces[i]);
	}
	s = s.replace(/[^a-zA-Z0-9-_ ]/g, '');
	s = s.replace(/( |-)/g, '-');
	s = s.replace(/( |-)+$/, '');
	this[settings.path] = s;
	next();
    });
}
