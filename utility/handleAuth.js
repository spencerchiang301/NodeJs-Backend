const { selectData, insertUpdateDeleteData } = require('../db/myconn'); // Import database connection

// Function to handle login logic
async function handleLogin(body, res) {
    try {
        // Parse the body to get username and password
        const { email, password } = JSON.parse(body);

        const queryString = `SELECT count(*) as count FROM users WHERE email = \'${email}\'
AND password = \'${password}\'`;
        console.log(queryString);

        // Execute the query using the selectData function from db/myconn.js
        const result = await selectData(queryString);

        console.log(result);

        // Check if any matching user is found
        if (result[0].count > 0) {
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Login successful', status: 'success' }));
        } else {
            res.writeHead(401);
            res.end(JSON.stringify({ message: 'Invalid credentials', status: 'fail' }));
        }
    } catch (error) {
        // Handle errors (e.g., JSON parse error or DB query error)
        res.writeHead(500);
        res.end(JSON.stringify({ message: 'Server error', error: error.message }));
    }
}

async function handleRegister(body, res) {
    try {
        // Parse the body to get username and password
        const { username, password, email } = JSON.parse(body);
        const currentTimeInMilliseconds = Date.now();

        const insertString = `Insert into users(name, password, email, created_at) value(\'${username}\',
    \'${password}\',\'${email}\',\'${currentTimeInMilliseconds}\');`;

        console.log(insertString);

        // Check if any matching user is found
        insertUpdateDeleteData(insertString)
            .then(result => {
                res.writeHead(200);
                res.end('New user registered successfully with timestamp!');
            })
            .catch(err => {
                res.writeHead(401);
                res.end('Error during registration:', err);
            });
    } catch (error) {
        // Handle errors (e.g., JSON parse error or DB query error)
        res.writeHead(500);
        res.end(JSON.stringify({ message: 'Server error', error: error.message }));
    }
}

async function handlePassword(body, res) {
    try {
        // Parse the body to get username and password
        const { username, original_password, new_password} = JSON.parse(body);
        const currentTimeInMilliseconds = Date.now();

        const queryString = `SELECT count(*) as count FROM users WHERE name = \'${username}\'
AND password = \'${original_password}\'`;

        console.log(queryString);

        let result = await selectData(queryString);

        if (result[0].count > 0) {
            const updateString = `Update users set password='${new_password}' WHERE name='${username}' limit 1`;

            insertUpdateDeleteData(updateString)
                .then(result => {
                    res.writeHead(200);
                    res.end(`Update password successfully for user: ${username}`);
                })
                .catch(err => {
                    res.writeHead(401);
                    res.end(`Error update password for user: ${username}`, err);
                });

        }
    } catch (error) {
        // Handle errors (e.g., JSON parse error or DB query error)
        res.writeHead(500);
        res.end(JSON.stringify({ message: 'Server error', error: error.message }));
    }
}


module.exports = {
    handleLogin,
    handleRegister,
    handlePassword
};