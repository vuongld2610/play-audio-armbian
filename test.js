
const cheerio = require('cheerio');
const axios = require('axios').default;
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');  // Sử dụng fs cho các thao tác stream

const fsPromises = require('fs').promises;  // Import fs.promises
const { all } = require('axios');

// Kiểm tra hệ điều hành
const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';



// Đường dẫn đến wmplayer.exe trên Windows
const wmplayerPath = 'C:\\Program Files\\Windows Media Player\\wmplayer.exe';


const getLink = async () => {
    const links = [];

    const { data } = await axios.get('https://samplelib.com/sample-mp3.html');
    const $ = cheerio.load(data);
    const audioTags = $('audio[src]');

    audioTags.each((index, element) => {
        links.push('https:' + $(element).attr('src'));
    })

    return links;
}




const downloadSoundFromURL = async (directURL) => {
    try {
        const response = await axios({
            method: 'get',
            url: directURL,
            responseType: 'stream'
        });

        const fileName = directURL.match(/[^/]+\.mp3/)[0];  // Tên file từ URL
        const filePath = path.join(__dirname, fileName);

        // Ghi file vào hệ thống
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        // Đảm bảo tệp được ghi xong trước khi tiếp tục
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        console.log(`Download completed: ${filePath}`);
    } catch (err) {
        console.error('Error downloading sound:', err);
        throw err;
    }
};




let getAllMP3files = async () => {
    try {
        const files = await fsPromises.readdir(__dirname);  // Đọc thư mục một cách bất đồng bộ
        const mp3Files = files.filter(file => path.extname(file).toLowerCase() === '.mp3');
        return mp3Files.map(mp3 => path.join(__dirname, mp3));

    } catch (err) {
        console.error('Error reading directory:', err);
        throw err;  // Nếu có lỗi, ném lại lỗi
    }
}



const removeAllMP3Files = async () => {
    try {
        const files = await fsPromises.readdir(__dirname);  // Đọc tất cả các file trong thư mục hiện tại
        const mp3Files = files.filter(file => path.extname(file).toLowerCase() === '.mp3');  // Lọc các file .mp3

        // Xóa các file .mp3
        for (const file of mp3Files) {
            const filePath = path.join(__dirname, file);
            await fsPromises.unlink(filePath);  // Xóa file mà không cần callback
            console.log(`Deleted: ${filePath}`);
        }

        console.log('All .mp3 files have been deleted.');
    } catch (err) {
        console.error('Error deleting .mp3 files:', err);
    }
};



// Hàm phát từng file trong danh sách
let playFilesSequentially = (mp3Paths, index = 0) => {


    if (index >= mp3Paths.length) return; // Kết thúc khi hết danh sách







    let player;

    console.log(`Đang phát file: ${mp3Paths[index]}`);

    if (isWindows) {
        // Sử dụng Windows Media Player (wmplayer) trên Windows
        console.log("da chon windows");
        player = spawn(wmplayerPath, [mp3Paths[index]]);
    } else if (isLinux) {
        // Sử dụng mpg123 hoặc ffmpeg trên Linux
        player = spawn('play', [mp3Paths[index]]);
    } else {
        console.error('Hệ điều hành không được hỗ trợ');
        return;
    }

    player.on('close', (code) => {
        if (code !== 0) {
            console.error(`Lỗi khi phát file: ${mp3Paths[index]}`);
        }
        // Phát file tiếp theo
        playFilesSequentially(mp3Paths, index + 1);
    });
}





// call section




getLink().then(async (links) => {
    await Promise.all(links.map(link => downloadSoundFromURL(link)));
    let allMP3 = await getAllMP3files();
    console.log(allMP3);
    await playFilesSequentially(allMP3);

});

//  removeAllMP3Files();
