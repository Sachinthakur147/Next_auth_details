import db from '../../utils/db';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { first_name, last_name, location, password, role = 'executive' } = req.body;

        try {
           
            await db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [first_name, password, role]);
            const userId = await db.query('SELECT LAST_INSERT_ID() as id');
            await db.query('INSERT INTO records (first_name, last_name, location, user_id) VALUES (?, ?, ?, ?)', [first_name, last_name, location, userId[0].id]);
            return res.status(201).json({ message: 'User and record created successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'User registration failed', error: error.message });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
