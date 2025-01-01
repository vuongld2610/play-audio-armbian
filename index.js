const axios = require('axios');
const fs = require('fs');
const path = require('path');
const player = require('play-sound')(opts = {});

async function playSoundFromUrl(url) {
    try {
        // Tải tệp MP3 về bộ nhớ tạm thời
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });

        const filePath = path.join(__dirname, 'temp.mp3');
        const writer = fs.createWriteStream(filePath);

        // Đảm bảo tệp được ghi xong trước khi tiếp tục
        await new Promise((resolve, reject) => {
            response.data.pipe(writer);

            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Phát tệp sau khi tải xong, bọc play vào một Promise
        await new Promise((resolve, reject) => {
            player.play(filePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        console.log('Sound played successfully!');

        // Xóa tệp sau khi phát xong
        // fs.unlinkSync(filePath);
    } catch (err) {
        console.error('Error playing sound:', err);
    }
}

// Ví dụ: Chơi nhạc từ URL
playSoundFromUrl('https://download.samplelib.com/mp3/sample-12s.mp3');
console.log("end")
