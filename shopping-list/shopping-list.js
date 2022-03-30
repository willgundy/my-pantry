import { renderShoppingOptions, renderGroceryItems, renderPantryItem } from '../render-utils.js';
import { createGroceryItem, createShoppingItem, getAllActiveGroceryItems, getAllShoppingItems, getSingleShoppingItemByName, getAllCompletedGroceryItems, updateGroceryItemStatus, createPantryItem, getPantryItemByItemId, updatePantryItemCount, getAllPantryItemsGreaterThanZero, deleteGroceryItem } from '../fetch-utils.js';

import { checkAuth, logout } from '../fetch-utils.js';

checkAuth();

const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', () => {
    logout();
});

const selectDataList = document.getElementById('grocery-item-list');
const groceryForm = document.getElementById('grocery-form');
const groceryList = document.getElementById('grocery-list');
const finishShoppingBtn = document.querySelector('.finishShoppingBtn');
const pantryList = document.getElementById('pantry-list');
const deleteAllBtn = document.getElementById('deleteAllBtn');


window.addEventListener('load', () => {
    displayGroceryItemOptions();
    displayGroceryItems();
    displayPantryItems();
});

async function displayGroceryItemOptions() {

    const shoppingItems = await getAllShoppingItems();

    for (let item of shoppingItems) {
        const optionEl = renderShoppingOptions(item);

        selectDataList.append(optionEl);
    }
}



//create grocery items to display
groceryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(groceryForm);

    const itemName = data.get('grocery-item');
    const itemCount = data.get('grocery-count');

    let item = await getSingleShoppingItemByName(itemName);

    if (!item) {
        const shoppingItem = generateShoppingItem(itemName);

        item = await createShoppingItem(shoppingItem);
    }

    const itemId = item.id;

    groceryForm.reset();

    const groceryItem = generateGroceryItem(itemId, itemCount);

    await createGroceryItem(groceryItem);

    displayGroceryItems();
});

function generateGroceryItem(itemId, itemCount) {
    return {
        item_id: itemId,
        count: itemCount,
        status: 'active'
    };
}

function generateShoppingItem(itemName) {
    return {
        item_name: itemName,
        measurement: null,
        Category: 'miscellaneous'
    };
}

function generatePantryItem(item) {
    return {
        item_id: item.item_id,
        count: item.count,
        status: 'active'
    };
}


//display grocery items
export async function displayGroceryItems() {
    const groceryItems = await getAllActiveGroceryItems();

    groceryList.innerHTML = '';

    for (let item of groceryItems) {
        const groceryItemEl = await renderGroceryItems(item);

        groceryList.append(groceryItemEl);
    }
}


//finish shopping action
finishShoppingBtn.addEventListener('click', async () => {
    const completedGroceryItems = await getAllCompletedGroceryItems();

    for (let item of completedGroceryItems) {
        updateGroceryItemStatus('finished', item.id);

        const existingPantryItem = await getPantryItemByItemId(item.item_id);

        if (existingPantryItem) {
            const newCount = existingPantryItem.count + item.count;
            await updatePantryItemCount(newCount, existingPantryItem.id);
        } else {
            const pantryItem = generatePantryItem(item);

            await createPantryItem(pantryItem);
        }
    }

    await displayGroceryItems();
    await displayPantryItems();
});

export async function displayPantryItems() {
    pantryList.innerHTML = '';
    const pantryItems = await getAllPantryItemsGreaterThanZero();

    for (let item of pantryItems) {
        const pantryItemEl = await renderPantryItem(item);

        pantryList.append(pantryItemEl);
    }
}

deleteAllBtn.addEventListener('click', async () => {
    const groceryItems = await getAllActiveGroceryItems();

    for (let item of groceryItems) {
        await deleteGroceryItem(item.id);
    }

    displayGroceryItems();
});
