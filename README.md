Takes a file and creates a clones

# Install
To use it you need [dron](https://github.com/morulus/dron) utility. I assume that you already have it.

```terminal
npm install dron-pipette -g
```

# Usage

Simple clone file
```
dron pipette anyModule.js newModule.js
```

# Options

## --multiply

```
dron pipette anyModule.js --multiply

```
Takes a file and starts command-line dialog for creating multiple clones of file. The pipette will be asking you for new file name, as long as you write it. The new file name should be specified without the extension. Files will be created with same extension as that of the source.

```terminal
? Enter name MyAnotherModule
File MyAnotherModule.js created
? Enter next name MyNextModule
File MyNextModule.js created
```

## --parse-name

All substrings in the new file's content, which equals to the source file name will be replaced with a new filename.

_myModule.js_
```js
class myModule {

}
```

```terminal
dron pipette myModule.js newModule.js --parse-name

```

_newModule.js_
```js
class newModule {

}
```

# License
MIT, 2016

# Author
Vladimir Kalmykov <vladimirmorulus@gmail.com>

