class Validator {
    static _value = null;

    // Set value to validate
    static value(val) {
        this._value = val;
        return this; // allow chaining
    }

    // ----------------- STRING VALIDATIONS -----------------
    static trim() {
        if (typeof this._value === 'string') this._value = this._value.trim();
        return this;
    }

    static required() {
        return this._value !== null && this._value !== undefined && this._value !== '';
    }

    static length(min = 0, max = Infinity) {
        if (typeof this._value !== 'string') return false;
        return this._value.length >= min && this._value.length <= max;
    }

    static hasSpecialChar() {
        if (typeof this._value !== 'string') return false;
        return /[!@#$%^&*(),.?":{}|<>]/.test(this._value);
    }

    static toUpperCase() {
        if (typeof this._value === 'string') this._value = this._value.toUpperCase();
        return this;
    }

    static toLowerCase() {
        if (typeof this._value === 'string') this._value = this._value.toLowerCase();
        return this;
    }

    static match(val2) {
        return this._value === val2;
    }

    // ----------------- NUMBER VALIDATIONS -----------------
    static isNumber() {
        return typeof this._value === 'number' && !isNaN(this._value);
    }

    static isInt() {
        return Number.isInteger(this._value);
    }

    static minMax(min = -Infinity, max = Infinity) {
        if (!this.isNumber()) return false;
        return this._value >= min && this._value <= max;
    }

    static decimalPlaces(maxDecimals = 2) {
        if (!this.isNumber()) return false;
        const parts = String(this._value).split('.');
        return parts[1] ? parts[1].length <= maxDecimals : true;
    }

    // ----------------- GENERAL -----------------
    static isEmpty() {
        return this._value === null || this._value === undefined || this._value === '';
    }

    static get() {
        return this._value;
    }

    // ----------------- DATE VALIDATIONS -----------------
    static isDate() {
        const date = new Date(this._value);
        return !isNaN(date.getTime());
    }

    static isBefore(compareDate) {
        if (!this.isDate()) return false;
        const date = new Date(this._value);
        return date < new Date(compareDate);
    }

    static isAfter(compareDate) {
        if (!this.isDate()) return false;
        const date = new Date(this._value);
        return date > new Date(compareDate);
    }

    static isToday() {
        if (!this.isDate()) return false;
        const date = new Date(this._value);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }
}

export default Validator;
