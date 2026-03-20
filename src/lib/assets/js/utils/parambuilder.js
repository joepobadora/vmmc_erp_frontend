// src/lib/utils/QueryBuilder.js
import { page } from '$app/state';
import { goto } from '$app/navigation';

class ParamBuilder {
    constructor(initial = {}) {
        this.params = new URLSearchParams(initial);
    }

    // chainable setter
    set(key, value) {
        if (value !== null && value !== undefined && value !== '') {
            this.params.set(key, value);
        } else {
            this.params.delete(key);
        }
        return this;
    }

    // remove key
    remove(key) {
        this.params.delete(key);
        return this;
    }

    // get value
    get(key) {
        return this.params.get(key);
    }

    // build string
    toString() {
        const str = this.params.toString();
        return str ? `?${str}` : '';
    }
}

export default ParamBuilder;
