-- 기존 테이블 삭제 (외래키 제약조건 때문에 역순으로 DROP)
DROP TABLE IF EXISTS Coupon;
DROP TABLE IF EXISTS Sponsor;
DROP TABLE IF EXISTS UmbrellaTraces;
DROP TABLE IF EXISTS Umbrella;
DROP TABLE IF EXISTS Station;
DROP TABLE IF EXISTS UserLocation;
DROP TABLE IF EXISTS User;

-- -- 1. User (회원)
-- CREATE TABLE User (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   email VARCHAR(255) NOT NULL UNIQUE,
--   password VARCHAR(255) NOT NULL,
--   name VARCHAR(100) NOT NULL,
--   gender ENUM('M', 'F', 'Other') DEFAULT NULL,
--   phone VARCHAR(20) DEFAULT NULL,
--   birth_date DATE DEFAULT NULL,
--   address VARCHAR(255) DEFAULT NULL,
--   school_or_company VARCHAR(255) DEFAULT NULL,
--   major_or_job VARCHAR(255) DEFAULT NULL,
--   interests TEXT DEFAULT NULL,
--   hobbies TEXT DEFAULT NULL,
--   reward_points INT DEFAULT 0,
--   overdue_days INT DEFAULT 0,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );

-- -- 2. 지도 (Map) - 사용자 위치 정보
-- CREATE TABLE UserLocation (
--   uid INT PRIMARY KEY,
--   location POINT NOT NULL,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   FOREIGN KEY (uid) REFERENCES User(id)
-- );

-- 3. Station (우산 보관소)
CREATE TABLE Station (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  address VARCHAR(255) NOT NULL,
  initial_umbrella_count INT DEFAULT 0,
  current_umbrella_count INT DEFAULT 0,
  max_umbrella_capacity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Umbrella (우산)
CREATE TABLE Umbrella (
  id INT AUTO_INCREMENT PRIMARY KEY,
  qr_info VARCHAR(255) UNIQUE NOT NULL,
  station_borrow_id INT DEFAULT NULL,  -- 대여 시작 스테이션
  station_return_id INT DEFAULT NULL,  -- 반납된 스테이션
  rent_start DATETIME DEFAULT NULL,
  rent_end DATETIME DEFAULT NULL,
  rent_returned DATETIME DEFAULT NULL, -- 실제 반납 처리 시간
  FOREIGN KEY (station_borrow_id) REFERENCES Station(id),
  FOREIGN KEY (station_return_id) REFERENCES Station(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- 5. UmbrellaTraces (우산 이동 경로)
CREATE TABLE UmbrellaTraces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  umbrella_id INT NOT NULL,
  station_id INT NOT NULL,
  trace_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (umbrella_id) REFERENCES Umbrella(id),
  FOREIGN KEY (station_id) REFERENCES Station(id)
);

-- -- 6. Sponsor (추천장소)
-- CREATE TABLE Sponsor (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   brand_name VARCHAR(255) NOT NULL,
--   industry VARCHAR(100) DEFAULT NULL,
--   address VARCHAR(255) DEFAULT NULL,
--   keywords TEXT DEFAULT NULL,
--   advertising_fee DECIMAL(15,2) DEFAULT 0.00,
--   discount_coupon TEXT DEFAULT NULL,
--   description TEXT DEFAULT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );

-- -- 7. Coupon (쿠폰)
-- CREATE TABLE Coupon (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   used BOOLEAN DEFAULT FALSE,
--   sponsor_id INT NOT NULL,
--   user_id INT DEFAULT NULL,  -- 쿠폰 소유자 (optional)
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   used_at TIMESTAMP NULL DEFAULT NULL,
--   FOREIGN KEY (sponsor_id) REFERENCES Sponsor(id),
--   FOREIGN KEY (user_id) REFERENCES User(id)
-- );
