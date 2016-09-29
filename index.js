//var temp = require('node-temp'); in future, maybe
/**
 Dron module `dron-pipette`*
*/
var fs = require('fs');
var path = require('path');

function substituteFile(file, newFile, options, once) {
	return function() {
		if (options["parse-name"]) {
			newFile.write(file.read().replace(new RegExp(file.name(), 'g'), newFile.name()));
		} else {
			newFile.write(file.read());
		}
		
		this.log('File '+path.basename(newFile.fullname)+' created');
		if (once) {
			return true;
		} else {
			return multiplyFile(file, options, 'Enter next name');
		}
	}
}

function multiplyFile(file, options, message) {
	return function() {
		var fileExt = file.extname();
		var filePureName = file.name();
		return this.run('prompt', {
			questions: [
				{
					type: 'input',
					name: 'name',
					default: '',
					message: message||'Enter name'
				}
			]
		}).then(function(answer) {
			if (answer.name=='') {
				return true;
			} else if (answer.name.toLowerCase()==filePureName.toLowerCase()) {
				return multiplyFile(file, options, 'Enter different filename');
			} else {
				var targetFilename = answer.name+fileExt;
				return pickFile(file.basename(), targetFilename, options);
			}
		}.bind(this));
	}
}

function operationist(file, options) {
	return function() {
		if (options.multiply) {
			return multiplyFile(file, options);
		} else {
			this.warn('You must specify flag');
			return null;
		}
	}
}

function pickFile(filename, targetFilename, options) {
	return function() {
		var file = this.touch(filename);
		if (!file.exists()) {
			this.warn('There is no such file');
			return null;
		} else {
			if (targetFilename) {
				var newFile = this.touch(targetFilename);
				if (newFile.exists()) {
					return this.run('confirm', {
						question: 'Such file already exists. Overrride?'
					}).then(function(result) {
						if (result) {
							return substituteFile(file, newFile, options);
						} else {
							return multiplyFile(file, options, 'Enter different name');
						}
					});
				} else {
					return substituteFile(file, newFile, options, true);
				}
			} else {
				return operationist(file, options);
			}
		}
	}
}

module.exports = function factory(argv) {

	if (argv._) {
		if (argv._[2]) {
			return pickFile(argv._[1], argv._[2], argv);
		} else if (argv._[1]) {
			return pickFile(argv._[1], false, argv);
		} else {
			console.log(fs.readFileSync(path.join(__dirname, 'manual'), 'utf-8'));
			return null;
		}
		
	}
	return dronPipette;
}