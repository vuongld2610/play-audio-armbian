const { spawn } = require('child_process');
const path = require('path');

// Danh sách các file MP3
const files = [
  path.join(__dirname, 'a.mp3'),
  path.join(__dirname, 'b.mp3'),
  path.join(__dirname, 'c.mp3')
];

// Kiểm tra hệ điều hành
const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';

// Đường dẫn đến wmplayer.exe trên Windows
const wmplayerPath = 'C:\\Program Files\\Windows Media Player\\wmplayer.exe';

// Hàm phát từng file trong danh sách
function playFilesSequentially(files, index = 0) {
  if (index >= files.length) return; // Kết thúc khi hết danh sách

  console.log(`Đang phát file: ${files[index]}`);

  let player;

  if (isWindows) {
    // Sử dụng Windows Media Player (wmplayer) trên Windows
    player = spawn(wmplayerPath, [files[index]]);
  } else if (isLinux) {
    // Sử dụng mpg123 hoặc ffmpeg trên Linux
    player = spawn('play', [files[index]]);
  } else {
    console.error('Hệ điều hành không được hỗ trợ');
    return;
  }

  player.on('close', (code) => {
    if (code !== 0) {
      console.error(`Lỗi khi phát file: ${files[index]}`);
    }
    // Phát file tiếp theo
    playFilesSequentially(files, index + 1);
  });
}

// Bắt đầu phát danh sách
playFilesSequentially(files);
