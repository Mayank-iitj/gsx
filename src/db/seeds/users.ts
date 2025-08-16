import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    const NOW = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    const professionalEmails = [
        'gmail.com',
        'company.com',
        'tech-corp.com',
        'business.org',
        'startup.io',
        'email.net',
        'solutions.co',
        'global.biz',
    ];

    const names = [
        // Mixed genders and backgrounds
        { firstName: 'Aisha', lastName: 'Khan' },
        { firstName: 'Ben', lastName: 'Carter' },
        { firstName: 'Chloe', lastName: 'Lian' },
        { firstName: 'David', lastName: 'Nguyen' },
        { firstName: 'Emily', lastName: 'White' },
        { firstName: 'Frank', lastName: 'Martinez' },
        { firstName: 'Grace', lastName: 'Jones' },
        { firstName: 'Henry', lastName: 'Zhu' },
        { firstName: 'Isabel', lastName: 'Garcia' },
        { firstName: 'Jack', lastName: 'Brown' },
        { firstName: 'Karen', lastName: 'Davies' },
        { firstName: 'Liam', lastName: 'Wilson' },
        { firstName: 'Mia', lastName: 'Taylor' },
        { firstName: 'Noah', lastName: 'Clark' },
        { firstName: 'Olivia', lastName: 'Rodriguez' },
        { firstName: 'Peter', lastName: 'Hall' },
        { firstName: 'Quinn', lastName: 'Lee' },
        { firstName: 'Rachel', lastName: 'Wright' },
        { firstName: 'Sam', lastName: 'Green' },
        { firstName: 'Tina', lastName: 'Baker' },
        { firstName: 'Umar', lastName: 'Hasan' },
        { firstName: 'Vera', lastName: 'Bell' },
        { firstName: 'William', lastName: 'King' },
        { firstName: 'Ximena', lastName: 'Lopez' },
        { firstName: 'Yara', lastName: 'Malik' },
    ];

    const roles = ['user', 'user', 'user', 'user', 'user', 'user', 'user', 'user', 'user', 'user', 'user', 'user', 'user', 'user', 'user', 'admin', 'admin', 'admin', 'admin', 'admin', 'manager', 'manager', 'manager', 'moderator', 'moderator'];
    const statuses = ['active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'inactive', 'inactive', 'inactive', 'pending', 'pending'];


    const sampleUsers = names.map((person, index) => {
        const domain = professionalEmails[index % professionalEmails.length];
        const email = `${person.firstName.toLowerCase()}.${person.lastName.toLowerCase()}@${domain}`;
        const fullName = `${person.firstName} ${person.lastName}`;
        const role = roles[index];
        const status = statuses[index];

        // joinDate: spread over last 2 years
        const joinDate = new Date(NOW.getTime() - Math.floor(Math.random() * (2 * 365 * oneDay))).toISOString();

        let lastSeen;
        if (status === 'active') {
            // lastSeen: within last 7 days for active users
            lastSeen = new Date(NOW.getTime() - Math.floor(Math.random() * (7 * oneDay))).toISOString();
        } else {
            // lastSeen: older for inactive/pending users (e.g., 30-90 days ago)
            lastSeen = new Date(NOW.getTime() - Math.floor(Math.random() * (60 * oneDay) + 30 * oneDay)).toISOString();
        }

        const createdAt = new Date(new Date(joinDate).getTime() - Math.floor(Math.random() * (30 * oneDay))).toISOString(); // created before or on join date
        const updatedAt = new Date().toISOString();


        return {
            name: fullName,
            email,
            avatar: `https://avatar.iran.liara.run/public/${index + 1}`, // Placeholder avatar
            role: role as 'user' | 'admin' | 'manager' | 'moderator',
            status: status as 'active' | 'inactive' | 'pending',
            lastSeen,
            joinDate,
            createdAt,
            updatedAt,
        };
    });

    await db.insert(users).values(sampleUsers);

    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});