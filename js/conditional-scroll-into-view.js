/* Adapted from https://stackoverflow.com/a/5354536 */
function entireElementVisible(elm) {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.top < 0 || rect.bottom - viewHeight >= 0);
}

/* Only activate scrollIntoView if the element is partially or fully outside of view.
 * scrollIntoViewIfRequired (and polyfill equivalent) is buggy (sometimes scrolls into the middle of the element), 
 * so this is being used instead.
*/
function conditionalScrollIntoView(e) {
  if (!entireElementVisible(e)) {
    e.scrollIntoView();
  }
}
