// helpers/Async.js
class Async {
    // Debounce: delays execution until user stops triggering for `delay` ms
    static debounce(callback, delay = 300) {
        let timer;
        return () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                callback();
            }, delay);
        };
    }

    // Sleep: simple async delay
    static sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

export default Async;
