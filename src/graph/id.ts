
export default (function () {
  let id = 0;
  return {
    newID: function newID() {
      return ++id;
    },
    set: function (n: number) {
      id = n;
    }
  }
})()
