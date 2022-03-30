import { deleteGroceryItem, getSingleShoppingItem, updateGroceryItemStatus, updatePantryItemCount } from './fetch-utils.js';
import { displayGroceryItems, displayPantryItems } from './shopping-list/shopping-list.js';

export function renderShoppingOptions(item) {
    const groceryOption = document.createElement('option');

    groceryOption.value = item.item_name;

    return groceryOption;
}

export async function renderGroceryItems(item) {
    const groceryItemEl = document.createElement('li');
    const groceryItemName = document.createElement('span');

    if (item.status === 'complete') {
        groceryItemName.classList.add('complete');
    }

    const shoppingName = await getSingleShoppingItem(item.item_id);

    groceryItemName.textContent = item.count + ' ' + shoppingName.item_name;
    groceryItemName.classList.add('itemName');
    groceryItemName.id = item.id;


    groceryItemName.addEventListener('click', (e) => {   
        const itemId = e.srcElement.id;

        if (groceryItemName.classList.contains('complete')) {
            updateGroceryItemStatus('active', itemId);
        } else {
            updateGroceryItemStatus('complete', itemId);
        }

        groceryItemName.classList.toggle('complete');
    });

    const removeItemDiv = renderRemoveGroceryItemDiv(item);

    groceryItemEl.append(groceryItemName, removeItemDiv);

    return groceryItemEl;
}

function renderRemoveGroceryItemDiv(item) {
    const removeGroceryItemEl = document.createElement('span');
    removeGroceryItemEl.classList.add('removeItem');
    removeGroceryItemEl.textContent = '\u00D7';
    removeGroceryItemEl.id = item.id;

    removeGroceryItemEl.addEventListener('click', async (e) => {
        const itemId = e.srcElement.id;

        await deleteGroceryItem(itemId); 

        displayGroceryItems();
    });

    return removeGroceryItemEl;
}

export async function renderPantryItem(item) {
    const pantryItemEl = document.createElement('li');

    const shoppingItem = await getSingleShoppingItem(item.item_id);

    pantryItemEl.textContent = shoppingItem.item_name;

    const pantryInfoSpan = document.createElement('span');
    pantryInfoSpan.classList.add('infoSpan');
    pantryInfoSpan.id = item.id;
    
    const countText = document.createElement('p');
    const useButton = document.createElement('button');
    const expireButton = document.createElement('button');

    countText.textContent = item.count;
    useButton.textContent = 'Use';
    expireButton.textContent = 'Expired';

    useButton.addEventListener('click', async (e) => {
        const itemId = e.path[1].id;
        let count = Number(e.path[1].childNodes[0].textContent);

        count--;

        e.path[1].childNodes[0].textContent = count;

        await updatePantryItemCount(count, itemId);

        if (count === 0) {
            await displayPantryItems();
        }
    });

    expireButton.addEventListener('click', async (e) => {
        const itemId = e.path[1].id;
        let count = 0;

        e.path[1].childNodes[0].textContent = count;

        await updatePantryItemCount(count, itemId);

        await displayPantryItems();
    });

    pantryInfoSpan.append(countText, useButton, expireButton);

    pantryItemEl.append(pantryInfoSpan);

    return pantryItemEl;
}