var mongoose = require('mongoose');

var upsert_model = function(/* data, where, callback */) {
    var data = null, where = null, skip = [], accept = [], callback = null;

    if (arguments.length < 1) {
	throw "Model::Upsert can not be called without the $data parameter";
    }

    data = arguments[0];

    for (var i = 1; i < arguments.length; i++) {
	if (typeof arguments[i] == "function") {
	    callback = arguments[i];
	} else if (arguments[i].constructor == Array) {
	    skip = arguments[1];
	} else if (typeof arguments[i] == 'object' || typeof arguments[i] == 'string') {
	    where = arguments[i];
	}
    }

    if (typeof data != 'object') {
	throw "Model::Upsert: $data must be an object";
    }

    if (callback != null && typeof callback != 'function') {
	throw "Model::Upsert: if provided, $callback must be a function";
    }

    // if our $data object does not have a save method, instantiate our model on it
    if (!data.save) {
	for (var i in data) {
	    if (data.hasOwnProperty(i)) {
		accept.push(i);
	    }
	}
	data = new this(data);
    }

    if (where == null) {
	// check on default _id field
	if (!data._doc._id) {
	    throw "Model::Upsert: no $where provided and no _id field in instance";
	}
	where = {'_id': data._doc._id};
    } else if (typeof where == 'string') {
	// name of field to check on
	if (!data._doc[where]) {
	    throw "Model::Upsert: field " + where + " in $where clause is not present in $data object";
	}
	var tmp = {};
	tmp[where] = data._doc[where];
	where = tmp;
    } else if (typeof where == 'object') {
	// use as-is
    }

    this.findOne(where, function(err, result) {
	if (err) {
	    callback(err);
	    return;
	} 
	if (result == null) {
	    data.save(function(err) {
		if (callback) {
		    callback(err);
		} else if (err != null) {
		    throw err;
		}
	    });
	    return;
	}
	for (var i in data._doc) {
	    if (data._doc.hasOwnProperty(i)) {
		//if ( && !(where.hasOwnProperty(i))) {
		if (accept.length > 0 && accept.indexOf(i) == -1) {
		    continue;
		}
		if (skip.indexOf(i) != -1) {
		    continue;
		}
		result[i] = data[i];
	    }
	}
	result.save(function(err) {
	    if (callback) {
		callback(err);
	    } else if (err != null) {
		throw err;
	    }
	});
    });
};

var upsert_instance = function(/* where, skip, callback */) {
    var args = [this];
    for (var i = 0; i < arguments.length; i++) {
	args[i + 1] = arguments[i];
    }
    this._parent_model.upsert.apply(this._parent_model, args);
};

var model_bk = mongoose.model;

mongoose.model = function() {
    console.log();
    var m = model_bk.apply(this, arguments);

    m.upsert = upsert_model;
    if (arguments.length) {
    }
    m.prototype._parent_model = m;
    m.prototype.upsert = upsert_instance;

    return m;
};

module.exports = mongoose;
