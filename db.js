const mysql = require('mysql2/promise');
require('dotenv').config();

// DB 연결 풀(Pool) 생성 - 효율적인 연결 관리를 위해 필수!
const pool = mysql.createPool({
  host: 'db', // docker-compose에 정의한 서비스 이름
  user: 'root',
  password: 'root_password',
  database: 'business_jp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 서버 시작 시 테이블이 없으면 생성하는 함수
const initDB = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS correction_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      context TEXT,
      original_text TEXT,
      corrected_text TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(sql);
  console.log("Database Table Ready");
};

initDB();

module.exports = pool;