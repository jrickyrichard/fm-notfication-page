document.addEventListener('DOMContentLoaded', function() {

    const getEl = tag => document.querySelector(tag);
    const getAllEl = tag => document.querySelectorAll(tag);
    const on = curry((e, fn, el) => new IO(() => el.addEventListener(e, fn)));


    class IO {
        constructor(fn) {
          if (typeof fn !== 'function') {
            throw new Error('IO expects a function');
          }
          this.unsafePerformIO = fn;
        }
      
        static of(effect) {
          return new IO(() => effect);
        }
      
        map(fn) {
          return new IO(() => fn(this.unsafePerformIO()));
        }
      
        flatMap(fn) {
          return new IO(() => fn(this.unsafePerformIO()).run());
        }
      
        run() {
          return this.unsafePerformIO();
        }
      }
      
    function curry(fn) {
        let arity = fn.length;
        return function _curry(...args) {
            return args.length < arity
                ? _curry.bind(null, ...args)
                : fn.call(null, ...args)
        }
    }

    let note = getAllEl('.note');
    let count = getEl('#count');
    let unread = getAllEl('.unread');
    let markAllAsRead = on('click', () => markAllCB(), getEl('#mark-all'));
    count.innerText = Array.from(unread).length;

    function markAllCB() {
        let note = getAllEl('.note')
        Array.from(note).map(
            item => {
                item.classList.remove('unread');
                item.querySelector('p')?.querySelector('span.dot')?.classList.remove('dot')
                count.innerText = '0'
            }
        )
    }

    function noteCB(item, obj) {
        item.classList.remove('unread');
        item.querySelector('p')?.querySelector('span.dot')?.classList.remove('dot');
        let filtered = Array.from(obj).filter(o => {
            return o.attributes.class.value.includes('unread')
        })

        count.innerText = filtered.length;
    }

    Array.from(note).map(item => on('click', () => noteCB(item, unread), item).run())
    markAllAsRead.run();

})