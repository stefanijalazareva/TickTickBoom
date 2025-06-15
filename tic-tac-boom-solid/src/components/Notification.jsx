import { createEffect } from 'solid-js';
import './stylecss.css';

function Notification(props) {
    return (
        <div
            class="notification"
            style={{ top: `${20 + props.index * 80}px` }}
        >
            <div class="notification-title">{props.notification.title}</div>
            <div>{props.notification.content}</div>
            {}
            {/* <button onClick={() => props.onClose(props.notification.id)}>X</button> */}
        </div>
    );
}

export default Notification;