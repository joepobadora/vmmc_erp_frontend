class Button {
    constructor(el) {
        this.element = el;
    }

    static el(el) {
        return new Button(el);
    }

    hide() {
        this.element.style.display = 'none';
        return this.element;
    }

    show() {
        this.element.style.display = 'block';
        return this.element;
    }

    setLoading(text, color = 'text-light') {
        const spinner = document.createElement('span');
        spinner.classList.add('spinner-border');
        spinner.classList.add(color);
        spinner.classList.add('spinner-border-sm');
        spinner.classList.add('me-2');
        this.element.innerText = text;
        this.element.prepend(spinner);
        this.element.setAttribute('disabled', true);

        return this.element;
    }

    resetLoading(text) {
        this.element.innerHTML = text;
        this.element.removeAttribute('disabled');

        return this.element;
    }
}

export default Button;
