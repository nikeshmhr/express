# Learning notes

Notes regarding my findings and understanding of express. The high level agenda for this is to document my understanding of how express works under the hook. I'll explore each file in the `lib` folder and note down my understanding of each file (module). If the file depends on some other third party library I'll document its purpose too.

Besides the workings of the library, I'll also document the language concepts, techniques, pattern which are heavily used in the codebase.

## Concepts

These are some of the concept, language feature I came across when exploring the codebase. Knowing about these concepts helps to understand the codebase better.

### Property descriptors

Every object property has 3 special attributes apart from its value (can call flags):

- `writable` - `true` means value can be changed, otherwise it's read-only
- `enumerable` - `true` means the property will be listed in loops (`for...in`), otherwise not listed
- `configurable` - `true` means the property can be deleted and these attributes can be modified later

By default, the value for all the above descriptors will be true. Also, has `get` and `set` which are property getter and setter respectively.

### prototype property

All functions have a prototype property, which is used to define properties and methods that will be inherited when the function is used as a constructor with the `new` keyword.

`__proto__` is a property on an instance of an object. It is used for prototype chain lookup and points to the prototype of the function (constructor) that created the instance.

```js
var a = {};
console.log(a.__proto__ === Object.prototype); // true

var Proto = function () {
  console.log("created");
};

// Proto.prototype is an empty object at this point
console.log(Proto.prototype); // {}

Proto.prototype.greet = function () {
  console.log("greetings");
};

// Usage:

// Creating an object using Object.create() - does not call constructor
var d = Object.create(Proto.prototype);
d.greet(); // Output: greetings

// Creating an object using `new` - calls constructor
var e = new Proto(); // Output: created
e.greet(); // Output: greetings

// both d and e were created from same prototype object
console.log(d.__proto__ === Proto.prototype); // true
console.log(e.__proto__ === Proto.prototype); // true
```

## Dependencies and its purpose

| Dependency          | Purpose                                                                                                              | Used in      | Library definition                             |
| :------------------ | :------------------------------------------------------------------------------------------------------------------- | :----------- | ---------------------------------------------- |
| `merge-descriptors` | To merge two objects. The objects will retain its values & descriptors. Property overwrite behavior is configurable. | `express.js` | Merge objects using their property descriptors |

## Module details

### `express.js`

Defines the main Express function, which creates an application instance and exports it as the default module export. Additionally, exports the imported application, request, response modules.

The exported function `createApplication` constructs the app by creating a anonymous function with signature `function(req, res, next)` and simply delegates by calling `app.handle` (added by `application.js` below) with all three parameters.

It then add properties from `EventEmitter.prototype` and `application.js`. Additionally, it add `request` and `response` properties by creating it from `request.js` and `response.js` files respectively. For each of them the `app` nested property is added to point to the `app` variable.

At the end, it calls the `app.init()` function added by `application.js` and returns the final `app` object.

Imports modules:

- `body-parser` - only used to export its functions
- EventEmitter from `node:events` used to inherit property and methods from EventEmitter prototype
- `merge-descriptors` - use to merge source object properties to destination
- `lib/application.js`
- `router` - only used to export its functions
- `lib/request.js` - added its properties to `app.request`
- `lib/response.js` - added its properties to `app.response`

### `application.js`

