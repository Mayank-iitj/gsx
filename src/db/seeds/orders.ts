import { db } from '@/db';
import { orders } from '@/db/schema';

async function main() {
    const customerNames = [
        "Alice Johnson", "Bob Williams", "Catherine Davis", "David Miller", "Emily Brown",
        "Frank Wilson", "Grace Moore", "Henry Taylor", "Isabella Anderson", "Jack Thomas",
        "Karen Jackson", "Liam White", "Mia Harris", "Noah Martin", "Olivia Clark",
        "Patrick Lewis", "Quinn Hall", "Rachel Young", "Samuel King", "Sophia Wright",
        "Thomas Hill", "Uma Green", "Victor Adams", "Wendy Baker", "Xavier Nelson",
        "Yara Carter", "Zack Mitchell", "Anna Roberts", "Ben Turner", "Chloe Phillips",
        "Daniel Campbell", "Ella Parker", "Felix Evans", "Gina Edwards", "Harry Collins"
    ];

    const statuses = {
        completed: 15,
        shipped: 8,
        processing: 6,
        pending: 4,
        cancelled: 2
    };

    const paymentMethods = [
        { method: 'credit_card', weight: 60 },
        { method: 'paypal', weight: 25 },
        { method: 'debit_card', weight: 10 },
        { method: 'bank_transfer', weight: 5 }
    ];

    const generateRandomDate = (monthsAgo: number, maxMonthsAgo: number): string => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - maxMonthsAgo, now.getDate());
        const end = new Date(now.getFullYear(), now.getMonth() - monthsAgo, now.getDate());
        const randomTimestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
        return new Date(randomTimestamp).toISOString();
    };

    const getRandomWeightedPaymentMethod = (): string => {
        const totalWeight = paymentMethods.reduce((sum, pm) => sum + pm.weight, 0);
        let random = Math.random() * totalWeight;
        for (const pm of paymentMethods) {
            if (random < pm.weight) {
                return pm.method;
            }
            random -= pm.weight;
        }
        return paymentMethods[0].method; // Fallback
    };

    const sampleOrders: typeof orders.$inferInsert[] = [];

    let statusCounts = { ...statuses };
    const allStatuses = Object.keys(statuses);

    for (let i = 0; i < 35; i++) {
        let currentStatus = '';
        while (true) {
            const tempStatus = allStatuses[Math.floor(Math.random() * allStatuses.length)];
            if (statusCounts[tempStatus as keyof typeof statuses] > 0) {
                currentStatus = tempStatus;
                statusCounts[tempStatus as keyof typeof statuses]--;
                break;
            }
        }

        const itemsCount = Math.floor(Math.random() * 8) + 1; // 1 to 8 items
        let amount = 0;
        if (itemsCount <= 2) {
            amount = Math.random() * (100 - 15.99) + 15.99; // Smaller amounts for fewer items
        } else if (itemsCount <= 5) {
            amount = Math.random() * (500 - 100) + 100;
        } else {
            amount = Math.random() * (1899.99 - 500) + 500; // Larger amounts for more items
        }

        const date = generateRandomDate(Math.random() > 0.6 ? 0 : (Math.random() > 0.3 ? 1 : 6), 6); // More recent dates
        const now = new Date();

        sampleOrders.push({
            customerName: customerNames[i % customerNames.length],
            amount: parseFloat(amount.toFixed(2)),
            status: currentStatus,
            date: date,
            itemsCount: itemsCount,
            paymentMethod: getRandomWeightedPaymentMethod(),
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        });
    }

    await db.insert(orders).values(sampleOrders);

    console.log('✅ Orders seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});