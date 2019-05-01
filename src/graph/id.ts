
export default (function () {
  let id = 0;
  return function newID() {
    return ++id;
  }
})()
