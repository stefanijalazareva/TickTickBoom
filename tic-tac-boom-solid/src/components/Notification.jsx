// src/components/Notification.jsx
import { createEffect } from 'solid-js';
import './stylecss.css';

function Notification(props) {
    // props:
    // - notification: An object like { id: number, title: string, content: string }
    // - index: The index of this notification in the parent's notifications array,
    //          used to position it visually.

    // You might want some simple animation or styling here.
    // The 'top' style is already handled by the App.jsx for stacking.

    return (
        <div
            class="notification"
            // Style to stack notifications visually
            style={{ top: `${20 + props.index * 80}px` }}
        >
            <div class="notification-title">{props.notification.title}</div>
            <div>{props.notification.content}</div>
            {/* Optionally, add a close button for manual dismissal */}
            {/* <button onClick={() => props.onClose(props.notification.id)}>X</button> */}
        </div>
    );
}

export default Notification;