// src/utils/utils.js

// --- Reminder Setup Logic (More robust version for SolidJS) ---
// This will need to be managed carefully, likely in App.jsx or a store.
let reminderIntervals = new Map(); // Keep track of timeouts for reminders

export function setupReminders(lists, onReminderDueCallback) {
    // Clear any existing reminders to prevent duplicates when lists change
    reminderIntervals.forEach(intervalId => clearTimeout(intervalId));
    reminderIntervals.clear();

    lists.forEach(list => {
        list.cards.forEach(card => {
            if (card.reminder) {
                const reminderTime = new Date(card.reminder);
                const now = new Date();
                const timeUntilReminder = reminderTime - now;

                if (timeUntilReminder > 0) {
                    const timeoutId = setTimeout(() => {
                        // Trigger the callback provided by App.jsx
                        onReminderDueCallback(card);
                        // Optionally remove the reminder from the map after it fires
                        reminderIntervals.delete(card.id);
                    }, timeUntilReminder);
                    reminderIntervals.set(card.id, timeoutId);
                }
            }
        });
    });
}

// --- Notification (browser API) ---
// This is for native browser notifications. The app's internal notification signal
// in App.jsx handles the in-app notification display.
export function showBrowserNotification(card) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Task Reminder', {
            body: card.content,
            icon: '⏰'
        });
    }
}

// --- Formatting and Status Utilities (from your original code) ---
export function formatReminderTime(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diff = date - now;
    if (diff < 0) return 'Overdue'; // Reminder already passed
    if (diff < 60000) return `${Math.floor(diff / 1000)}s`; // Show seconds if less than a minute
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    // If more than a day, show the localized date
    return date.toLocaleDateString();
}

export function formatDueDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) return 'Due today';
    if (dateOnly.getTime() === tomorrowOnly.getTime()) return 'Due tomorrow';
    if (dateOnly < todayOnly) {
        const diffDays = Math.floor((todayOnly - dateOnly) / 86400000);
        return `Overdue by ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
    return `Due ${date.toLocaleDateString()}`;
}

export function getDueDateStatus(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

    if (dateOnly < todayOnly) return 'overdue';
    if (dateOnly.getTime() === todayOnly.getTime()) return 'today';
    if (dateOnly.getTime() === tomorrowOnly.getTime()) return 'tomorrow';
    return 'future';
}

export function isReminderDue(isoString) {
    // Check if reminder time is in the past or current moment
    return new Date(isoString) <= new Date();
}