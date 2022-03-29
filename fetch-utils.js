const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiYnp4bXNrYWdwcm92cWNjcm1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDc1NTM0MzksImV4cCI6MTk2MzEyOTQzOX0.wkKK4FheZyrNrf7B04tLKfQuyVwpMO3ycPvoUWD6S9M';

const SUPABASE_URL = 'https://rbbzxmskagprovqccrmk.supabase.co';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

export function getUser() {
    return client.auth.session() && client.auth.session().user;
}

export function checkAuth() {
    const user = getUser();

    if (!user) location.replace('../');
}

export function redirectIfLoggedIn() {
    if (getUser()) {
        location.replace('./shopping-list');
    }
}

export async function signupUser(email, password) {
    const response = await client.auth.signUp({ email, password });

    return response.user;
}

export async function signInUser(email, password) {
    const response = await client.auth.signIn({ email, password });

    return response.user;
}

export async function logout() {
    await client.auth.signOut();

    return (window.location.href = '../');
}

//shopping items
export async function getAllShoppingItems() {
    const response = await client 
        .from('shopping-items')
        .select('*');

    return response.body;
}

export async function getSingleShoppingItem(id) {
    const response = await client 
        .from('shopping-items')
        .select('*')
        .match({ 'id': id })
        .single();

    return response.body;
}

export async function createShoppingItem(item) {
    const response = await client
        .from('shopping-items')
        .insert(item);
    
    return response.body;
}

//grocery items
export async function getAllGroceryItems() {
    const response = await client 
        .from('grocery-items')
        .select('*');

    return response.body;
}

export async function createGroceryItem(item) {
    const response = await client
        .from('grocery-items')
        .insert(item);
    
    return response.body;
}

export async function updateGroceryItemStatus(status, id) {
    const response = await client 
        .from('grocery-items')
        .update({ 'status': status })
        .match({ 'id': id })
        .single();

    return response.body;
}

export async function updateGroceryItemCount(count, id) {
    const response = await client 
        .from('grocery-items')
        .update({ 'count': count })
        .match({ 'id': id })
        .single();

    return response.body;
}


//pantry items
export async function getAllPantryItems() {
    const response = await client 
        .from('pantry-items')
        .select('*');

    return response.body;
}

export async function getPantryItemByItemId(item_id) {
    const response = await client 
        .from('pantry-items')
        .select('*')
        .match({ 'item_id': item_id });

    return response.body;
}

export async function getAllPantryItemsGreaterThanZero() {
    const response = await client 
        .from('pantry-items')
        .select('*')
        .gt('count', 0);

    return response.body;
}

export async function createPantryItem(item) {
    const response = await client
        .from('pantry-items')
        .insert(item);
    
    return response.body;
}

export async function updatePantryItemCount(count, id) {
    const response = await client 
        .from('pantry-items')
        .update({ 'count': count })
        .match({ 'id': id })
        .single();

    return response.body;
}