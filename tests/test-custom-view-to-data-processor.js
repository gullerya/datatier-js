﻿(function () {
	'use strict';

	var suite = window.Utils.JustTest.createSuite({ name: 'Testing Custom View to Data Processor' }),
		data = window.Observable.from({
			text: 'some text',
			date: new Date()
		});

	suite.addTest({ name: 'testing setup of the processor from create' }, function (pass, fail) {
		var ie = document.createElement('input'), tie, e;

		function customVTDProc(input) {
			//	assuming for the test purposes that the path is on single node
			input.data[input.path[0]] = input.view.value.toUpperCase();
		}

		tie = window.DataTier.ties.create('testCustomVTDA', data);
		tie.viewToDataProcessor = customVTDProc;

		ie.dataset.tieValue = 'testCustomVTDA:text';
		document.body.appendChild(ie);

		setTimeout(function () {
			if (ie.value !== data.text) fail('test precondition failed; value expected to be ' + data.text + ', found: ' + ie.value);

			e = new Event('change');
			ie.dispatchEvent(e);

			setTimeout(function () {
				if (ie.value !== data.text.toUpperCase()) fail('value expected to be ' + data.text.toUpperCase() + ', found: ' + ie.value);

				pass();
			});
		}, 0)
	});

	suite.run();
})();