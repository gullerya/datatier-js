﻿(() => {
	'use strict';

	const namespace = this || window,
		controllers = {};

	if (!namespace.DataTier) {
		throw new Error('DataTier framework was not properly initialized');
	}

	function Controller(name, options) {
		Reflect.defineProperty(this, 'name', {value: name});
		Reflect.defineProperty(this, 'dataToView', {value: options.dataToView});
		if (typeof options.inputToData === 'function') {
			Reflect.defineProperty(this, 'inputToData', {value: options.inputToData});
		}
		if (typeof options.parseParam === 'function') {
			Reflect.defineProperty(this, 'parseParam', {value: options.parseParam});
		}
		if (typeof options.isChangedPathRelevant === 'function') {
			Reflect.defineProperty(this, 'isChangedPathRelevant', {value: options.isChangedPathRelevant});
		}
	}

	Controller.prototype.parseParam = function(controllerParam) {
		let tieName = '', dataPath = [];
		if (controllerParam) {
			dataPath = controllerParam.trim().split('.');
			tieName = dataPath.shift();
		}
		return {
			tieName: tieName,
			dataPath: dataPath
		};
	};
	Controller.prototype.isChangedPathRelevant = function(changedPath, viewedPath) {
		return viewedPath.startsWith(changedPath);
	};

	function addController(name, configuration) {
		if (typeof name !== 'string' || !name) {
			throw new Error('name MUST be a non-empty string');
		}
		if (controllers[name]) {
			throw new Error('controller "' + name + '" already exists; you may want to reconfigure the existing controller');
		}
		if (typeof configuration !== 'object' || !configuration) {
			throw new Error('configuration MUST be a non-null object');
		}
		if (typeof configuration.dataToView !== 'function') {
			throw new Error('configuration MUST have a "dataToView" function defined');
		}

		controllers[name] = new Controller(name, configuration);
		namespace.DataTier.views.applyController(controllers[name]);
	}

	function getController(name) {
		return controllers[name];
	}

	function removeController(name) {
		if (typeof name !== 'string' || !name) {
			throw new Error('controller name MUST be a non-empty string');
		}

		return delete controllers[name];
	}

	function getApplicable(element) {
		let result = [];
		if (element && element.dataset) {
			Object.keys(element.dataset)
				.filter(key => key in controllers)
				.map(key => controllers[key])
				.forEach(controller => result.push(controller));
		}
		return result;
	}

	Reflect.defineProperty(namespace.DataTier, 'controllers', {
		value: {
			get get() {
				return getController;
			},
			get add() {
				return addController;
			},
			get remove() {
				return removeController;
			},
			get getApplicable() {
				return getApplicable;
			}
		}
	});

})();