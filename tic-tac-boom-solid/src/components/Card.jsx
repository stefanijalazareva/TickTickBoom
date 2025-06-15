import { Show, For } from 'solid-js';
import { formatDueDate, formatReminderTime, getDueDateStatus, isReminderDue, showBrowserNotification } from '../utils/utils.js';

function Card(props) {
    const card = props.card;
    const listId = props.listId;

    const handleShare = (e) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: card.content,
                text: card.description || '',
                url: window.location.href
            });
        } else {
            showBrowserNotification({ content: 'Web Share API not supported. Task details: ' + card.content });
        }
    };

    const handleQuickDelete = (e) => {
        e.stopPropagation();
        console.log(`Quick deleting card ID: ${card.id} from list ID: ${listId}`);
        if (props.onDelete) {
            props.onDelete(card.id, listId);
        }
    };

    const dueDateStatus = () => getDueDateStatus(card.dueDate);

    return (
        <div
            class="card"
            onClick={() => props.onEdit(card, listId)}
            draggable="true"
            onDragStart={(e) => {
                e.dataTransfer.setData('cardId', card.id);
                e.dataTransfer.setData('sourceListId', listId);
            }}
        >
            <Show when={card.profileIcon}>
                <img src={card.profileIcon} alt="Profile" class="profile-icon" onError={(e) => { e.target.src = 'https://placehold.co/32x32/cccccc/333333?text=PF'; }} />
            </Show>

            <Show when={card.image}>
                <img src={card.image} alt="Task image" class="card-image" onError={(e) => { e.target.src = 'https://placehold.co/120x80/eeeeee/333333?text=No+Image'; }} />
            </Show>

            <Show when={card.labels && card.labels.length}>
                <div class="card-labels">
                    <For each={card.labels}>
                        {(label) => <span class="card-label">{label}</span>}
                    </For>
                </div>
            </Show>

            <Show when={card.category}>
                <div class="card-category">{card.category}</div>
            </Show>

            <div class="card-content">{card.content}</div>

            <Show when={card.dueDate}>
                <div classList={{
                    'card-due-date': true,
                    'due-date-overdue': dueDateStatus() === 'overdue',
                    'due-date-today': dueDateStatus() === 'today',
                    'due-date-tomorrow': dueDateStatus() === 'tomorrow'
                }}>
                    <span>📅</span>
                    <span>{formatDueDate(card.dueDate)}</span>
                </div>
            </Show>

            <Show when={card.reminder}>
                <div class="card-reminder">
                    <span class="reminder-icon">⏰</span>
                    <span classList={{ 'reminder-due-text': isReminderDue(card.reminder) }}>
            {formatReminderTime(card.reminder)}
          </span>
                </div>
            </Show>

            <button class="share-btn" onClick={handleShare}>Share</button>
            <button
                class="quick-delete-btn"
                onClick={handleQuickDelete}
                style="background: #e74c3c; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; font-size: 0.9em; font-weight: bold; cursor: pointer; opacity: 0.7; transition: opacity 0.2s, background-color 0.2s; line-height: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.2); float: right;"
            >
                ✕
            </button>
        </div>
    );
}

export default Card;
