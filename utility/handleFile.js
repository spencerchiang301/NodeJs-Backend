const fs = require('fs');
const path = require('path');

// Function to handle file upload
function handleFileUpload(req, res) {
    const boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');

    let body = '';

    // Listen for data being sent
    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', () => {
        // Parse the multipart/form-data
        const parts = body.split(`--${boundary}`);
        const filePart = parts.find(part => part.includes('filename='));

        if (!filePart) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('No file uploaded');
            return;
        }

        // Extract the file content
        const fileContentStart = filePart.indexOf('\r\n\r\n') + 4;
        const fileContentEnd = filePart.lastIndexOf('\r\n--');
        const fileContent = filePart.slice(fileContentStart, fileContentEnd);

        // Extract the filename
        const fileNameMatch = filePart.match(/filename="(.+?)"/);
        const fileName = fileNameMatch ? fileNameMatch[1] : null;

        if (!fileName) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Filename not found');
            return;
        }

        // Get file extension
        const fileExtension = path.extname(fileName).toLowerCase();

        let uploadDir;
        if (fileExtension === '.pdf') {
            uploadDir = path.resolve(__dirname, '../public/pdf');
        } else if (fileExtension === '.csv') {
            uploadDir = path.resolve(__dirname, '../public/csv');
        } else if (fileExtension === '.json') {
            uploadDir = path.resolve(__dirname, '../public/json');
        } else {
            uploadDir = path.resolve(__dirname, '../public/others'); // Other files will go to /public/others
        }

        // Ensure the directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Write the file to the correct directory
        const filePath = path.join(uploadDir, fileName);

        fs.writeFile(filePath, fileContent, 'binary', err => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error writing file');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('File uploaded successfully');
        });
    });
}

function handleImageUpload(req, res) {
    const boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');

    let body = '';

    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', () => {
        const parts = body.split(`--${boundary}`);
        const filePart = parts.find(part => part.includes('filename='));

        if (!filePart) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('No image uploaded');
            return;
        }

        const fileContentStart = filePart.indexOf('\r\n\r\n') + 4;
        const fileContentEnd = filePart.lastIndexOf('\r\n--');
        const fileContent = filePart.slice(fileContentStart, fileContentEnd);

        const fileNameMatch = filePart.match(/filename="(.+?)"/);
        const fileName = fileNameMatch ? fileNameMatch[1] : null;

        if (!fileName) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Filename not found');
            return;
        }

        const fileExtension = path.extname(fileName).toLowerCase();

        // Check if the file is an image
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
        if (!allowedExtensions.includes(fileExtension)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid file type. Only image files are allowed.');
            return;
        }

        const uploadDir = path.resolve(__dirname, '../public/images');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);

        fs.writeFile(filePath, fileContent, 'binary', err => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error writing file');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Image uploaded successfully');
        });
    });
}

module.exports = {
    handleFileUpload,
    handleImageUpload,
};