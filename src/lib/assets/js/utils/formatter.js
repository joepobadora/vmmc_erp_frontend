class Format {
    static _value = null;
    static _result = null;

    // Set date value
    static date(value) {
        this._value = value;
        this._result = new Date(value);
        return this;
    }

    // Set string value
    static string(value) {
        this._value = value;
        this._result = String(value);
        return this;
    }

    static toDatetime() {
        this._result = this._result.toLocaleString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        return this._result;
    }

    static toDateOnly() {
        this._result = this._result.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        return this._result;
    }

    static toTimeOnly() {
        this._result = this._result.toLocaleString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
        });
        return this._result;
    }

    static toFullMonthDate() {
        this._result = this._result.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        return this._result;
    }

    static toShortMonthDate() {
        this._result = this._result.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
        return this._result;
    }

    static toISODate() {
        const d = this._result;
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        this._result = `${year}-${month}-${day}`;
        return this._result;
    }

    static toDatetimeLocal() {
        const d = this._result;
        return (
            d.getFullYear() +
            '-' +
            String(d.getMonth() + 1).padStart(2, '0') +
            '-' +
            String(d.getDate()).padStart(2, '0') +
            'T' +
            String(d.getHours()).padStart(2, '0') +
            ':' +
            String(d.getMinutes()).padStart(2, '0')
        );
    }

    static toMilliseconds() {
        const d = this._result;

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        const milliseconds = String(d.getMilliseconds()).padStart(3, '0');

        this._result = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
        return this._result;
    }
}

export default Format;
