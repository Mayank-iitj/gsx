import { db } from '@/db';
import { activityLogs } from '@/db/schema';

async function generateActivityLogs() {
    const logs = [];
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day

    const actions = [
        { type: 'login', descriptions: ['User logged in from {location}', 'Successful authentication'] },
        { type: 'logout', descriptions: ['User logged out', 'Session ended'] },
        { type: 'purchase', descriptions: ['Purchased {item} for ${amount}', 'Completed order #{orderNumber}'] },
        { type: 'update', descriptions: ['Updated profile information', 'Changed account settings'] },
        { type: 'view', descriptions: ['Viewed product {pName}', 'Accessed dashboard'] },
        { type: 'search', descriptions: ['Searched for "{query}"', 'Applied filters'] },
        { type: 'create', descriptions: ['Created new {item}', 'Added {item} to cart'] },
        { type: 'delete', descriptions: ['Removed {item}', 'Deleted account data'] }
    ];

    const locations = ['New York, USA', 'London, UK', 'Berlin, Germany', 'Tokyo, Japan', 'Sydney, Australia', 'Paris, France', 'Remote location'];
    const products = ['Gaming Laptop', 'Mechanical Keyboard', 'Wireless Mouse', '4K Monitor', 'Smartwatch', 'Noise-Cancelling Headphones', 'SSD Drive', 'USB-C Hub'];
    const searchQueries = ['drones under $500', 'best gaming pc', 'ergonomic chairs', 'webcam reviews', 'cloud storage solutions'];
    const items = ['invoice', 'report', 'user account', 'task'];

    // More activity for users with lower IDs (simulating admin/manager)
    const userActivityWeights = Array.from({ length: 25 }, (_, i) => {
        if (i < 5) return 3; // Users 1-5 (admin/manager)
        if (i < 15) return 2; // Users 6-15 (regular frequent users)
        return 1; // Users 16-25 (less frequent users)
    });

    for (let i = 0; i < 120; i++) {
        const userId = Math.floor(Math.random() * 25) + 1; // User IDs 1-25

        // Weighted timestamp generation: more recent activity
        let daysAgo = -Math.log(Math.random()) * 8; // Exponential distribution
        daysAgo = Math.min(daysAgo, 29); // Cap to 29 days
        const timestampDate = new Date(now.getTime() - daysAgo * oneDay - Math.random() * oneDay); // Add randomness within the day

        const actionEntry = actions[Math.floor(Math.random() * actions.length)];
        let description = actionEntry.descriptions[Math.floor(Math.random() * actionEntry.descriptions.length)];

        // Fill in dynamic parts of the description
        if (description.includes('{location}')) {
            description = description.replace('{location}', locations[Math.floor(Math.random() * locations.length)]);
        }
        if (description.includes('{item}')) {
            const randomItem = actionEntry.type === 'purchase' || actionEntry.type === 'create' || actionEntry.type === 'delete' ? products[Math.floor(Math.random() * products.length)] : items[Math.floor(Math.random() * items.length)];
            description = description.replace('{item}', randomItem);
        }
        if (description.includes('{amount}')) {
            description = description.replace('{amount}', (Math.random() * 1000 + 10).toFixed(2));
        }
        if (description.includes('{orderNumber}')) {
            description = description.replace('{orderNumber}', Math.floor(Math.random() * 90000) + 10000);
        }
        if (description.includes('{pName}')) {
            description = description.replace('{pName}', products[Math.floor(Math.random() * products.length)]);
        }
        if (description.includes('{query}')) {
            description = description.replace('{query}', searchQueries[Math.floor(Math.random() * searchQueries.length)]);
        }

        // Apply activity weight
        for (let k = 0; k < userActivityWeights[userId - 1]; k++) {
            logs.push({
                userId: userId,
                action: actionEntry.type,
                description: description,
                timestamp: timestampDate.toISOString(),
                createdAt: new Date().toISOString(), // Use current time for createdAt for the seeder run
            });
        }
    }

    // Sort logs by timestamp to simulate natural flow for better readability of generated data
    logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Take only the first 120 logs after sorting and weighting
    return logs.slice(0, 120);
}

async function main() {
    const sampleActivityLogs = await generateActivityLogs();
    
    await db.insert(activityLogs).values(sampleActivityLogs);
    
    console.log('✅ ActivityLogs seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});