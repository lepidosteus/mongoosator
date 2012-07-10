mongoosator
===========

A few plugins I made when working with mongoose

They require the "underscore" library to be available for require

created_updated_at.js
-------------

A plugin to automatically add two fields to your models, respectively tracking date of the row's creation date and it's last modification time

Options allow to chose the fields' names and add an index to them

```javascript
var Schema = mongoose.Schema;

var TableSchema = new Schema({
    // your usual schema definition
});

var m_created_updated_at = require('./created_updated_at.js');

TableSchema.plugin(m_created_updated_at, {created_index: true});

var Row = mongoose.model('Table', TableSchema);

// row is now an instance of your model, with two more fields "created_at" and "updated_at", of type Date. The "created_at" field will be indexed.
```


slug.js
-------------

A plugin to automatically add a slug field to your model, taking its value from another field after some processing. This is usefull for example when you want your article to have an "url-ready" title along the actual title.

eg:
Title: "Un bel été !"
Slug: "un-bel-ete"

Options allow to chose whether the field should be enforced as unique, as lowercase, its name and what other field it should consider as its source.

```javascript
var TableSchema = new Schema({
    // your usual schema definition
    some_source_field : {
	type: String,
	required: true
    }
    // ...
});

var m_slug = require('./slug.js');

TableSchema.plugin(m_slug, {source: 'some_source_field', path: 'slug_field');

var Row = mongoose.model('Table', TableSchema);

// row is now an instance of your model, with an added field "slug_field" which contains the slug generated from "some_source_field"
```


upsert
-------------

Mongoose does not offer easy upsert functionnality by default (at least at the time of writing), this library aims to change that

Instead of loading mongoose the traditionnal way, you require mongoose through this file, and you will receive a modifier mongoose instance, that adds upsert() capabilities to all models, as well as a global upsert() function on the global mongoose instance, alongside its other methods.

You do not have to modify your models in any way to benefit from it.

```javascript
// require mongoose through this lib
var mongoose = require('./upsert.js');
var Schema = mongoose.Schema;

var TableSchema = new Schema({
    // your usual schema definition
});

var Table = mongoose.model('Table', TableSchema);

var Row = new Table({/* ... data ... */});

// row now has an upsert() function doing exactly what you would expect, either save or update if it already exists

Row.upsert(function(err) {
    if (err != null) {
	console.log('Error while saving');
	console.log(err);
    }
});

// you can provide several other arguments to refine your upsert:

// specify your "where" condition, you can provide a full mongoose where or simply a field name
// in this exemple the insert will be transformed into an update if any other rows has the same value for the field "title"
// by default the "_id" field is used

Row.upsert("title", function(err) {
    if (err != null) {
	console.log('Error while saving');
	console.log(err);
    }
});

// specify fields that should *not* be updated
// for exemple, you might not want the fields "something" and "original_insert_date" to be updated by the upsert

Row.upsert("title", ["original_insert_date", "something"], function(err) {
    if (err != null) {
	console.log('Error while saving');
	console.log(err);
    }
});
```
