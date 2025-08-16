import { db } from '@/db';
import { componentInteractions } from '@/db/schema';

async function main() {
    const today = new Date();
    const getDateNDaysAgo = (n: number) => {
        const d = new Date(today);
        d.setDate(today.getDate() - n);
        return d;
    };

    const sampleInteractions = [];

    // InputField (30 interactions)
    for (let i = 0; i < 6; i++) {
        // focus/blur
        sampleInteractions.push({
            componentType: 'InputField',
            interactionType: 'focus',
            data: { fieldName: 'email', duration: Math.floor(Math.random() * 2000) + 500 },
            timestamp: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
            createdAt: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
        });
        sampleInteractions.push({
            componentType: 'InputField',
            interactionType: 'blur',
            data: { fieldName: 'email', duration: Math.floor(Math.random() * 2000) + 500 },
            timestamp: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
            createdAt: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
        });
    }

    const searchQueries = ['drizzle orm', 'typescript', 'database seeder', 'web development', 'ui components', 'analytics dashboard'];
    for (let i = 0; i < 9; i++) {
        // input
        const query = searchQueries[Math.floor(Math.random() * searchQueries.length)];
        sampleInteractions.push({
            componentType: 'InputField',
            interactionType: 'input',
            data: { fieldName: 'search', length: query.length, value: query },
            timestamp: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
            createdAt: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
        });
    }

    const fieldNames = ['password', 'username', 'confirmPassword', 'address'];
    for (let i = 0; i < 9; i++) {
        // validation
        const isValid = Math.random() > 0.5;
        const field = fieldNames[Math.floor(Math.random() * fieldNames.length)];
        sampleInteractions.push({
            componentType: 'InputField',
            interactionType: 'validation',
            data: { fieldName: field, isValid: isValid, errors: isValid ? [] : ['Required field missing', 'Invalid format'] },
            timestamp: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
            createdAt: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
        });
    }

    // DataTable (25 interactions)
    const columns = ['name', 'status', 'price', 'createdAt', 'category'];
    const directions = ['asc', 'desc'];
    for (let i = 0; i < 7; i++) {
        // sort
        const column = columns[Math.floor(Math.random() * columns.length)];
        const prevColumn = Math.random() > 0.7 ? columns[Math.floor(Math.random() * columns.length)] : '';
        sampleInteractions.push({
            componentType: 'DataTable',
            interactionType: 'sort',
            data: { column: column, direction: directions[Math.floor(Math.random() * directions.length)], previousColumn: prevColumn },
            timestamp: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
            createdAt: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
        });
    }

    const statuses = ['active', 'inactive', 'pending', 'archived'];
    const categories = ['electronics', 'books', 'clothes', 'home'];
    for (let i = 
        0; i < 6; i++) {
        // filter
        const column = Math.random() > 0.5 ? 'status' : 'category';
        const value = column === 'status' ? statuses[Math.floor(Math.random() * statuses.length)] : categories[Math.floor(Math.random() * categories.length)];
        sampleInteractions.push({
            componentType: 'DataTable',
            interactionType: 'filter',
            data: { column: column, value: value, resultCount: Math.floor(Math.random() * 100) + 5 },
            timestamp: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
            createdAt: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
        });
    }

    for (let i = 0; i < 4; i++) {
        // paginate
        sampleInteractions.push({
            componentType: 'DataTable',
            interactionType: 'paginate',
            data: { page: Math.floor(Math.random() * 5) + 2, pageSize: 10, totalPages: 15 },
            timestamp: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
            createdAt: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
        });
    }

    for (let i = 0; i < 4; i++) {
        // select
        sampleInteractions.push({
            componentType: 'DataTable',
            interactionType: 'select',
            data: { itemId: Math.floor(Math.random() * 50) + 1, selected: Math.random() > 0.5, type: 'single' },
            timestamp: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
            createdAt: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
        });
    }

    for (let i = 0; i < 4; i++) {
        // export
        sampleInteractions.push({
            componentType: 'DataTable',
            interactionType: 'export',
            data: { format: Math.random() > 0.5 ? 'csv' : 'json', rowsExported: Math.floor(Math.random() * 200) + 50 },
            timestamp: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
            createdAt: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
        });
    }

    // Button (15 interactions)
    const buttonIds = ['submitForm', 'saveChanges', 'deleteItem', 'createNew', 'viewDetails', 'cancelOrder'];
    for (let i = 0; i < 10; i++) {
        // click
        const buttonId = buttonIds[Math.floor(Math.random() * buttonIds.length)];
        sampleInteractions.push({
            componentType: 'Button',
            interactionType: 'click',
            data: { buttonId: buttonId, position: { x: Math.floor(Math.random() * 300) + 50, y: Math.floor(Math.random() * 150) + 25 } },
            timestamp: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
            createdAt: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
        });
    }

    for (let i = 0; i < 3; i++) {
        // hover
        const buttonId = buttonIds[Math.floor(Math.random() * buttonIds.length)];
        sampleInteractions.push({
            componentType: 'Button',
            interactionType: 'hover',
            data: { buttonId: buttonId, duration: Math.floor(Math.random() * 1000) + 100 },
            timestamp: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
            createdAt: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
        });
    }

    for (let i = 0; i < 2; i++) {
        // disabled_click
        const buttonId = buttonIds[Math.floor(Math.random() * buttonIds.length)];
        sampleInteractions.push({
            componentType: 'Button',
            interactionType: 'disabled_click',
            data: { buttonId: buttonId, reason: 'form_invalid' },
            timestamp: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
            createdAt: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
        });
    }

    // Modal (10 interactions)
    const modalIds = ['confirmDelete', 'editUser', 'productDetails', 'loginModal'];
    for (let i = 0; i < 3; i++) {
        // open
        const modalId = modalIds[Math.floor(Math.random() * modalIds.length)];
        sampleInteractions.push({
            componentType: 'Modal',
            interactionType: 'open',
            data: { modalId: modalId, source: 'button_click' },
            timestamp: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
            createdAt: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
        });
    }

    for (let i = 0; i < 3; i++) {
        // close
        const modalId = modalIds[Math.floor(Math.random() * modalIds.length)];
        sampleInteractions.push({
            componentType: 'Modal',
            interactionType: 'close',
            data: { modalId: modalId, method: 'escape_key' },
            timestamp: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
            createdAt: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
        });
    }

    for (let i = 0; i < 2; i++) {
        // confirm
        const modalId = modalIds[Math.floor(Math.random() * modalIds.length)];
        sampleInteractions.push({
            componentType: 'Modal',
            interactionType: 'confirm',
            data: { modalId: modalId, action: 'proceed_delete', payload: { id: Math.floor(Math.random() * 100) + 1 } },
            timestamp: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
            createdAt: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
        });
    }

    for (let i = 0; i < 2; i++) {
        // cancel
        const modalId = modalIds[Math.floor(Math.random() * modalIds.length)];
        sampleInteractions.push({
            componentType: 'Modal',
            interactionType: 'cancel',
            data: { modalId: modalId, context: 'unsaved_changes' },
            timestamp: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
            createdAt: getDateNDaysAgo(Math.floor(Math.random() * 14)).toISOString(),
        });
    }

    await db.insert(componentInteractions).values(sampleInteractions);

    console.log('✅ Component Interactions seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});