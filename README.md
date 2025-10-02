# E-Commerce 

## Description
`index.js` - The main entry of the program. It uses the `StoreManager` to execute actions.
`store.ts` - The main public layer with which the `App` communicates with. It is facade-like pattern.
/services - Folder with singleton services for the various actions and database manipulations
/migrations - Migrations
/entities - Entities
/common - Common shared functionality

## Feature Flow
1. Create Customer
2. Create Product
3. Add to Cart
4. Create Order
5. Complete Order

Key features:
- CRUD Operations
- Notify (@Notify) decorator to emit event.
- Event Handler(@OnEvent) decorator to subscribe and handle emitted event.
- Application of discount based on Customer status (isPremium)
- Simple payment simulation using promises