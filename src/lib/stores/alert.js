import { writable } from 'svelte/store';

function alertStore() {
    const { subscribe, update } = writable([]);

    const icons = new Map([
        ["success", 'bi-check-circle-fill text-success'],
        ["info", 'bi-info-square-fill text-primary'],
        ["danger", 'bi-exclamation-triangle-fill text-warning'],
        ["error", 'bi-x-octagon-fill text-danger'],
    ]);

    const options = {
        month: 'short',  // Sep
        day: 'numeric',  // 21
        year: 'numeric', // 2025
        hour: 'numeric', // 9
        minute: '2-digit', // 45
        hour12: true     // 12-hour format with AM/PM
    };

    function show(variant = 'info', title = '', message = '') {
        const activeId = Date.now();

        variant = icons.get(variant);
        const subtitle = new Date().toLocaleString('en-CA', options);
        update(alertList => [...alertList, { activeId, variant, title, subtitle, message }]);

        setTimeout(() => {
            dismiss(activeId)
        }, 5000);
    }

    function dismiss(deletedId) {
        update(alertList => alertList.filter(alert => alert.activeId !== deletedId));
    }

    return { subscribe, show, dismiss };
}

export const Alert = alertStore();
