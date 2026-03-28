class Format {
    static _value = null;
    static _result = null;

    // Set date value
    // Example:
    // Format.date('2026-03-27T10:05:30')
    static date(value) {
        this._value = value;
        this._result = new Date(value);
        return this;
    }

    // Set string value
    // Example:
    // Format.string(123) -> "123"
    static string(value) {
        this._value = value;
        this._result = String(value);
        return this;
    }

    // Set number value
    // Example:
    // Format.number("123.45") -> 123.45
    static number(value) {
        this._value = value;
        this._result = Number(value);
        return this;
    }

    // Convert to full datetime
    // Example:
    // Format.date('2026-03-27T10:05:30').toDatetime()
    // -> "03/27/2026, 10:05 AM"
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

    // Convert to date only
    // Example:
    // Format.date('2026-03-27T10:05:30').toDateOnly()
    // -> "03/27/2026"
    static toDateOnly() {
        this._result = this._result.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        return this._result;
    }

    // Convert to time only
    // Example:
    // Format.date('2026-03-27T10:05:30').toTimeOnly()
    // -> "10:05 AM"
    static toTimeOnly() {
        this._result = this._result.toLocaleString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
        });
        return this._result;
    }

    // Full month format
    // Example:
    // Format.date('2026-03-27').toFullMonthDate()
    // -> "March 27, 2026"
    static toFullMonthDate() {
        this._result = this._result.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        return this._result;
    }

    // Short month format
    // Example:
    // Format.date('2026-03-27').toShortMonthDate()
    // -> "Mar 27, 2026"
    static toShortMonthDate() {
        this._result = this._result.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
        return this._result;
    }

    // ISO date (YYYY-MM-DD)
    // Example:
    // Format.date('2026-03-27').toISODate()
    // -> "2026-03-27"
    static toISODate() {
        const d = this._result;
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        this._result = `${year}-${month}-${day}`;
        return this._result;
    }

    // Datetime for input[type="datetime-local"]
    // Example:
    // Format.date('2026-03-27T10:05:30').toDatetimeLocal()
    // -> "2026-03-27T10:05"
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

    // Datetime with milliseconds
    // Example:
    // Format.date('2026-03-27T10:05:30.123').toMilliseconds()
    // -> "2026-03-27 10:05:30.123"
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

    // Convert bytes to MB
    // Example:
    // Format.number(1048576).toFileSize()
    // -> "1.00 MB"
    static toFileSize() {
        const bytes = this._value;
        this._result = (bytes / 1024 / 1024).toFixed(2) + ' MB';
        return this._result;
    }
}

export default Format;
