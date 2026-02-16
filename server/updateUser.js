const db = require('./config/db');
const bcrypt = require('bcryptjs');

const updateAdminUser = async () => {
    try {
        const username = 'Abdo';
        const password = 'Gaara2001';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user exists
        const existingUser = await db.query("SELECT * FROM users WHERE username = $1", [username]);

        if (existingUser.rows.length > 0) {
            // Update existing user
            await db.query("UPDATE users SET password = $1 WHERE username = $2", [hashedPassword, username]);
            console.log('User password updated successfully!');
        } else {
            // Check if any user exists
            const anyUser = await db.query("SELECT * FROM users");

            if (anyUser.rows.length > 0) {
                // Update the first user to new credentials
                await db.query("UPDATE users SET username = $1, password = $2 WHERE id = $3", [username, hashedPassword, anyUser.rows[0].id]);
                console.log('Existing user updated with new credentials!');
            } else {
                // Insert new user
                await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, hashedPassword]);
                console.log('New admin user created!');
            }
        }

        console.log('\n=================================');
        console.log('Dashboard Login Credentials:');
        console.log('Username: Abdo');
        console.log('Password: Gaara2001');
        console.log('=================================\n');

        process.exit(0);
    } catch (err) {
        console.error('Error updating user:', err.message);
        process.exit(1);
    }
};

updateAdminUser();
