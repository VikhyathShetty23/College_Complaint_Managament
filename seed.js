const db = require('./db');

async function seed() {
    try {
        console.log('Seeding departments...');
        
        // We will ignore if they already exist
        const query = `
            INSERT IGNORE INTO Department (dept_name, location) VALUES
            ('Computer Science', 'Main Block'),
            ('Information Science', 'Tech Block'),
            ('Electronics and Communication', 'Circuit Block'),
            ('Civil', 'Infrastructure Block'),
            ('Mechanical', 'Workshop Block'),
            ('AI&ML', 'Tech Block'),
            ('AI&DS', 'Tech Block'),
            ('Robotics', 'Innovation Center')
        `;
        
        const [result] = await db.execute(query);
        console.log(`Inserted ${result.affectedRows} departments.`);
    } catch (e) {
        console.error('Seeding failed:', e);
    } finally {
        process.exit();
    }
}
seed();
