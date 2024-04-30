const { exec } = require('child_process');
const https = require('https');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('Please provide a programming language.');
    process.exit(1);
}

const encodedQuery = encodeURIComponent(args.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
const repoUrl = `https://api.github.com/repos/cat-milk/Anime-Girls-Holding-Programming-Books/contents/${encodedQuery}`;

function getRandomPhoto(url) {
    const options = {
        headers: {
            'User-Agent': 'Node.js'
        }
    };

    https.get(url, options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const files = JSON.parse(data);
                if (files.length === 0) {
                    console.error('No files found in this directory.');
                    return;
                }
                const images = files.filter(file => file.type === 'file' && /\.(jpg|jpeg|png|gif)$/i.test(file.name));
                if (images.length === 0) {
                    console.error('No images found in this directory.');
                    return;
                }
                const randomIndex = Math.floor(Math.random() * images.length);
                const randomImage = images[randomIndex].download_url;
                console.log(`Randomly selected image: ${randomImage}`);
                openUrl(randomImage);
            } catch (error) {
                console.error('Failed to parse response:', error.message);
            }
        });
    }).on('error', (error) => {
        console.error('Error fetching data:', error.message);
    });
}

function openUrl(url) {
    switch (process.platform) {
        case 'darwin': // MacOS
            exec(`open "${url}"`);
            break;
        case 'win32': // Windows
            exec(`start "${url}"`);
            break;
        case 'linux': // Linux
            exec(`xdg-open "${url}"`);
            break;
        default:
            console.error('Platform not supported');
            process.exit(1);
    }
}

getRandomPhoto(repoUrl);
console.log(`Searching for a random photo of a anime girl holding a "${args.join(' ')} book"`);
