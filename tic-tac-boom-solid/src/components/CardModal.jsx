// src/components/CardModal.jsx
import { createSignal, createEffect, For, Show } from 'solid-js';

function CardModal(props) {
    const isNew = props.isNew;
    // Use createMemo to derive initial values from props.card.
    // This will re-run if props.card changes.
    const cardData = () => props.card || {
        content: '',
        description: '',
        labels: [],
        category: '',
        image: '',
        profileIcon: '',
        reminder: null,
        dueDate: null
    };

    // Signals for form fields.
    const [content, setContent] = createSignal('');
    const [description, setDescription] = createSignal('');
    const [category, setCategory] = createSignal('');
    const [customCategory, setCustomCategory] = createSignal('');
    const [labels, setLabels] = createSignal('');
    const [image, setImage] = createSignal('');
    const [profileIcon, setProfileIcon] = createSignal('');
    const [reminder, setReminder] = createSignal('');
    const [dueDate, setDueDate] = createSignal('');

    // IMPORTANT: This effect synchronizes the modal's internal signals
    // with the card data passed via props whenever cardData() changes.
    createEffect(() => {
        const currentCard = cardData();
        setContent(currentCard.content || '');
        setDescription(currentCard.description || '');
        setCategory(currentCard.category || '');
        setLabels(currentCard.labels ? currentCard.labels.join(', ') : '');
        setImage(currentCard.image || '');
        setProfileIcon(currentCard.profileIcon || '');
        // Format dates for input type="datetime-local" and type="date"
        setReminder(currentCard.reminder ? new Date(currentCard.reminder).toISOString().slice(0, 16) : '');
        setDueDate(currentCard.dueDate ? new Date(currentCard.dueDate).toISOString().slice(0, 10) : '');
        setCustomCategory(''); // Always clear custom category field on new card load/edit
    });


    const availableCategories = () => props.categories;

    const handleSave = () => {
        const finalCategory = category() === '__custom__' ? customCategory().trim() : category();
        const updatedCard = {
            ...cardData(), // Use current cardData (from prop) to retain ID if editing
            content: content().trim(),
            description: description(),
            category: finalCategory,
            labels: labels().split(',').map(l => l.trim()).filter(Boolean),
            image: image(),
            profileIcon: profileIcon(),
            reminder: reminder() ? new Date(reminder()).toISOString() : null,
            dueDate: dueDate() ? new Date(dueDate()).toISOString() : null,
        };
        props.onSave(updatedCard, props.listId, isNew);
        props.onClose();
    };

    const handleClear = () => {
        props.onClose(); // Consistently acts as "Cancel" and closes the modal
    };

    const handleDeleteClick = () => {
        console.log(`CardModal: Deleting card ID: ${cardData().id} from list ID: ${props.listId}`);
        if (props.onDelete && cardData().id && props.listId) { // Ensure cardId and listId are valid
            props.onDelete(cardData().id, props.listId);
            props.onClose();
        } else {
            console.error("CardModal: Cannot delete, missing card ID or list ID.", { cardId: cardData().id, listId: props.listId });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                handleSave();
            }
        } else if (e.key === 'Escape') {
            props.onClose();
        }
    };

    let contentInputRef; // Ref to automatically focus the content input
    createEffect(() => {
        // Only focus if the modal is actually open and contentInputRef is valid
        if (contentInputRef && (props.editingCard || props.addingCardToListId)) {
            contentInputRef.focus();
        }
    });

    return (
        <div class="modal" onClick={(e) => e.target === e.currentTarget && props.onClose()}>
            <div class="modal-content">
                <div class="modal-header">
                    <Show when={profileIcon()}>
                        <img src={profileIcon()} alt="Profile" class="profile-icon" onError={(e) => { e.target.src = 'https://placehold.co/40x40/cccccc/333333?text=PF'; }} />
                    </Show>
                    <h3>{isNew ? 'Add Task' : content() || 'Task Details'}</h3>
                </div>

                <Show when={image()}>
                    <img src={image()} alt="Task image" class="card-image" onError={(e) => { e.target.src = 'https://placehold.co/120x80/eeeeee/333333?text=No+Image'; }} />
                </Show>

                <label for="taskContent">Task:</label>
                <input
                    id="taskContent"
                    type="text"
                    value={content()}
                    onInput={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    ref={contentInputRef}
                    style="width: 100%;"
                />

                <label for="taskDescription">Description:</label>
                <textarea
                    id="taskDescription"
                    value={description()}
                    onInput={(e) => setDescription(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows="3"
                    style="width: 100%;"
                ></textarea>

                <label for="taskCategory">Category:</label>
                <select
                    id="taskCategory"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category()}
                    style="width: 100%;"
                >
                    <option value="">Select category</option>
                    <For each={availableCategories()}>
                        {(cat) => <option value={cat}>{cat}</option>}
                    </For>
                    <option value="__custom__">Add new category...</option>
                </select>
                <Show when={category() === '__custom__'}>
                    <input
                        type="text"
                        placeholder="Enter new category"
                        value={customCategory()}
                        onInput={(e) => setCustomCategory(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style="width: 100%;"
                    />
                </Show>

                <label for="taskLabels">Labels (comma separated):</label>
                <input
                    id="taskLabels"
                    type="text"
                    value={labels()}
                    onInput={(e) => setLabels(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style="width: 100%;"
                />

                <label for="taskImage">Image URL:</label>
                <input
                    id="taskImage"
                    type="text"
                    value={image()}
                    onInput={(e) => setImage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style="width: 100%;"
                />

                <label for="taskProfileIcon">Profile Icon URL:</label>
                <input
                    id="taskProfileIcon"
                    type="text"
                    value={profileIcon()}
                    onInput={(e) => setProfileIcon(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style="width: 100%;"
                />

                <label for="taskReminder">Reminder:</label>
                <input
                    id="taskReminder"
                    type="datetime-local"
                    value={reminder()}
                    onInput={(e) => setReminder(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style="width: 100%;"
                />

                <label for="taskDueDate">Due Date:</label>
                <input
                    id="taskDueDate"
                    type="date"
                    value={dueDate()}
                    onInput={(e) => setDueDate(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style="width: 100%;"
                />

                <div class="modal-buttons">
                    <button onClick={handleSave}>
                        {isNew ? 'Add Task' : 'Save'}
                    </button>
                    <button onClick={handleClear}>
                        Cancel
                    </button>
                    <Show when={!isNew}>
                        <button class="delete-btn" onClick={handleDeleteClick} style="background: #dc3545; color: white;">
                            Delete
                        </button>
                    </Show>
                </div>
            </div>
        </div>
    );
}

export default CardModal;
