const clearTimer = timer => {
    window.clearTimeout(timer);
    window.clearInterval(timer);
    //window.clearImmediate(timer);
}
export default clearTimer;