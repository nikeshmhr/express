# Learning notes

Notes regarding my findings and understanding of express. The high level agenda for this is to document my understanding of how express works under the hook. I'll explore each file in the `lib` folder and note down my understanding of each file (module). If the file depends on some other third party library I'll document its purpose too.

Besides the workings of the library, I'll also document the language concepts, techniques, pattern which are heavily used in the codebase.

## Concepts

These are some of the concept, language feature I came across when exploring the codebase. Knowing about these concepts helps to understand the codebase better.

### Property descriptors

Every object property have 3 special attributes apart from its value (can call flags):

- `writable` - `true` means value can be changed, otherwise it's read-only
- `enumerable` - `true` means the property will be listed in loops (`for...in`), otherwise not listed
- `configurable` - `true` means the property can be deleted and these attributes can be modified

By default, the value for all the above descriptors will be true. Also, has `get` and `set` which are property getter and setter respectively.

## Dependencies and its purpose

| Dependency          |                                                       Purpose                                                        | Used in      | Library definition                             |
| :------------------ | :------------------------------------------------------------------------------------------------------------------: | :----------- | ---------------------------------------------- |
| `merge-descriptors` | To merge two objects. The objects will retain its values & descriptors. Property overwrite behavior is configurable. | `express.js` | Merge objects using their property descriptors |

## Module details

### `express.js`

Creates an application and exposes it as default. Additionally, exports the imported application, request, response modules. The exported function `createApplication` constructs the app by creating a middleware like anonymous function with signature `function(req, res, next)` and simply delegates by calling `app.handle` with all three parameters.
