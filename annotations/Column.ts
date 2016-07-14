export function Column(target: any, key: string);
export function Column(options: any);
export function Column(...args) {

  let target;
  let key;

  if (args.length === 2) {

    target = args[0];
    key = args[1];

    createBookshelfGetterAndSetter(target, key);

  } else if (args.length === 1) {

    return function (target: any, key: string) {

      createBookshelfGetterAndSetter(target, key);
    }
  }
}

function createBookshelfGetterAndSetter(target, key) {

  let oldValue;

  Object.defineProperty(target, key, {
    get: function () {

      // bookshelf getter
      return this.get(key);
    },
    set: function (value) {

      // to prevent infinite loop for "id" property:
      // bookshelf updates the "id" property
      // within the bookshelf setter, which
      // would cause an infinite loop
      if (oldValue !== value) {
        oldValue = value;

        // bookshelf setter
        this.set(key, value);
      }

    },
    enumerable: true,
    configurable: true
  });
}
