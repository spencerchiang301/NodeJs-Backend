const { selectData, insertUpdateDeleteData } = require('../db/mysql/mysqlConn'); // Import database connection

// Function to handle login logic
async function handleLogin(body, res) {
    try {
        // Parse the body to get username and password
        const { email, password } = JSON.parse(body);

        const queryString = `SELECT id, name, email FROM users WHERE email = \'${email}\'
AND password = \'${password}\'`;

        console.log(queryString);

        // Execute the query using the selectData function from db/mysqlConn.js
        const result = await selectData(queryString);

        console.log(result);

        // Check if any matching user is found
        if (result.length > 0) {
            const user = result[0];
            console.log('User found:', user);

            // Respond with a success message and user details
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Login successful', user }));
        } else {
            // Respond with an error message if no user is found
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid email or password' }));
        }
    } catch (error) {
        // Handle errors (e.g., JSON parse error or DB query error)
        res.writeHead(500);
        res.end(JSON.stringify({ message: 'Server error', error: error.message }));
    }
}

async function handleRegister(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString(); // Convert binary data to a string
    });

    req.on('end', async () => {
        try {
            // Parse the body to get username and password
            const {name, email, password} = JSON.parse(body);
            const currentTimeInMilliseconds = Date.now();

            const queryString = `Select count(*) as count from users where email=\'${email}\';`
            const result = await selectData(queryString);

            if (result[0].count > 1) {
                res.writeHead(401, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'The email had registered!!!'}));
            } else {
                const insertString = `Insert into users(name, password, email, created_at) value(\'${name}\',
    \'${password}\',\'${email}\',\'${currentTimeInMilliseconds}\');`;

                console.log(insertString);

                // Check if any matching user is found
                insertUpdateDeleteData(insertString)
                    .then(result => {
                        res.writeHead(200);
                        res.end(JSON.stringify({message: 'Register successful'}));
                    })
                    .catch(err => {
                        res.writeHead(401);
                        res.end('Error during registration:', err);
                    });
            }
        } catch (error) {
            // Handle errors (e.g., JSON parse error or DB query error)
            res.writeHead(500);
            res.end(JSON.stringify({message: 'Server error', error: error.message}));
        }
    });
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