Object.defineProperty = function defineProperty(object, property, descriptor) {
	// handle object
	if (object === null || !(object instanceof Object || typeof object === 'object')) {
		throw new TypeError('Object must be an object');
	}

	// handle descriptor
	if (!(descriptor instanceof Object)) {
		throw new TypeError('Descriptor must be an object');
	}

	var
	ERR_ACCESSORS_NOT_SUPPORTED = 'getters & setters can not be defined on this javascript',
	ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value',
	hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor,
	propertyString = String(property),
	Element = window.Element || {};

	// handle descriptor.get
	if ('get' in descriptor) {
		if (typeof descriptor.get !== 'function') {
			throw new TypeError('Getter expected a function');
		}
		if (hasValueOrWritable) {
			throw new TypeError(ERR_VALUE_ACCESSORS);
		}
		if (object !== Element.prototype) {
			throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
		}
		object[propertyString] = new Element.__getter__(descriptor.get);
	}

	// handle descriptor.set
	if ('set' in descriptor) {
		if (typeof descriptor.get !== 'function') {
			throw new TypeError('Getter expected a function');
		}
		if (hasValueOrWritable) {
			throw new TypeError(ERR_VALUE_ACCESSORS);
		}
		if (object.constructor !== Element) {
			throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
		}
		object.attachEvent('onpropertychange', function callee(event) {
			object.detachEvent('onpropertychange', callee);

			if (event.propertyName === propertyString) {
				object[propertyString] = descriptor.set.call(object, object[propertyString]);
			}

			object.attachEvent('onpropertychange', callee);
		});
	}

	if ('value' in descriptor) {
		object[propertyString] = descriptor.value;
	}

	// return object
	return object;
};
