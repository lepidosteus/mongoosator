var _ = require('underscore');

module.exports = function created_updated_at(schema, options) {
    var settings = {
	created_path: 'created_at',
	updated_path: 'updated_at',
	created_index: false,
	updated_index: false
    }

    _.extend(settings, options);

    if (_.isString(settings.created_path) && settings.created_path.length > 0) {
	var field = {};
	field[settings.created_path] = {type: Date, default: Date.now};
	schema.add(field);

	if (settings.created_index) {
	    schema.path(settings.created_path).index(true);
	}
    }

    if (_.isString(settings.updated_path) && settings.updated_path.length > 0) {
	var field = {};
	field[settings.updated_path] = {type: Date, default: Date.now};
	schema.add(field);

	if (settings.updated_index) {
	    schema.path(settings.updated_path).index(true);
	}

	schema.pre('save', function(next) {
	    this[settings.updated_path] = new Date;
	    next();
	});
    }
}
