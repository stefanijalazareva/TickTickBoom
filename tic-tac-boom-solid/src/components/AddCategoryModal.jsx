import { createSignal } from 'solid-js';

function AddCategoryModal(props) {
    const [newCategoryName, setNewCategoryName] = createSignal('');

    const handleInputChange = (e) => {
        setNewCategoryName(e.target.value);
    };

    const handleAddClick = () => {
        const trimmedName = newCategoryName().trim();
        if (trimmedName) {
            props.onAdd(trimmedName);
        }
        props.onClose();
    };

    const handleCancelClick = () => {
        props.onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddClick();
        } else if (e.key === 'Escape') {
            handleCancelClick();
        }
    };

    return (
        <div class="modal" onClick={(e) => e.target === e.currentTarget && handleCancelClick()}>
            <div class="modal-content">
                <h3>Add Category</h3>
                <input
                    type="text"
                    placeholder="Category name"
                    value={newCategoryName()}
                    onInput={handleInputChange}
                    onKeyDown={handleKeyDown}
                    style="width: 100%; margin-bottom: 8px;"
                    autofocus
                />
                <div class="modal-buttons"> {}
                    <button class="add-category-btn" onClick={handleAddClick}>
                        Add Category
                    </button>
                    <button class="cancel-btn" onClick={handleCancelClick} style="margin-left: 8px;"> {}
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddCategoryModal;