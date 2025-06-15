import { For } from 'solid-js';
import Card from './Card.jsx';

function List(props) {
    const list = props.list;

    const cardsToDisplay = () => list.cards;

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');

        const cardId = parseInt(e.dataTransfer.getData('cardId'));
        const sourceListId = parseInt(e.dataTransfer.getData('sourceListId'));

        if (sourceListId === list.id) {
            console.log(`Card ${cardId} dropped within the same list ${list.id}`);
            return;
        }

        if (props.onMoveCard) {
            props.onMoveCard(cardId, sourceListId, list.id);
        }
    };

    return (
        <div class="list">
            <div class="list-header">{list.title}</div>
            <button class="add-task-btn" onClick={() => props.onAddCard(list.id)}>
                + Add Task
            </button>
            <div
                class="list-cards"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <For each={cardsToDisplay()}>
                    {(card) => (
                        <Card
                            card={card}
                            listId={list.id}
                            onEdit={(editedCard) => props.onEditCard(editedCard, list.id)}
                            onDelete={props.onDeleteCard}
                        />
                    )}
                </For>
            </div>
        </div>
    );
}

export default List;
