import { createSignal } from 'solid-js';

function AddCategoryModal(props) {
    // props:
    // - onAdd: A function from the parent (App.jsx) to call when a new category is added.
    //          It expects the new category name as an argument.
    // - onClose: A function from the parent (App.jsx) to call to close the modal.

    // Signal to store the value of the input field for the new category name
    const [newCategoryName, setNewCategoryName] = createSignal('');

    // Handle input changes (controlled component pattern)
    const handleInputChange = (e) => {
        setNewCategoryName(e.target.value);
    };

    // Handle the "Add Category" button click
    const handleAddClick = () => {
        const trimmedName = newCategoryName().trim();
        if (trimmedName) { // Only add if the input is not empty
            props.onAdd(trimmedName); // Call the parent's onAdd function
        }
        props.onClose(); // Always close the modal after attempting to add
    };

    // Handle the "Cancel" button click or modal background click
    const handleCancelClick = () => {
        props.onClose(); // Simply close the modal
    };

    // Handle keyboard events, specifically 'Enter' to add and 'Escape' to cancel
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddClick();
        } else if (e.key === 'Escape') {
            handleCancelClick();
        }
    };

    return (
        // The modal overlay. Clicking outside the modal content closes it.
        <div class="modal" onClick={(e) => e.target === e.currentTarget && handleCancelClick()}>
            <div class="modal-content">
                <h3>Add Category</h3>
                <input
                    type="text"
                    placeholder="Category name"
                    value={newCategoryName()} // Controlled by newCategoryName signal
                    onInput={handleInputChange}
                    onKeyDown={handleKeyDown} // Listen for Enter/Escape
                    style="width: 100%; margin-bottom: 8px;"
                    autofocus // Automatically focus the input when the modal opens
                />
                <div class="modal-buttons"> {/* Added a div for button alignment/styling */}
                    <button class="add-category-btn" onClick={handleAddClick}>
                        Add Category
                    </button>
                    <button class="cancel-btn" onClick={handleCancelClick} style="margin-left: 8px;"> {/* Added some margin */}
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddCategoryModal;