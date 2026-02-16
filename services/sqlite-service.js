import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("ev_motor.db");

export const initDB = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT,
        fullname TEXT,
        emergency_phone TEXT,
        profile_image_uri TEXT,
        firebase_id TEXT,
        is_synced INTEGER DEFAULT 0
      );
    `);

    db.execSync(`
      CREATE TABLE IF NOT EXISTS trips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT,        
        vehicle_id TEXT,        
        start_time TEXT,        
        end_time TEXT,          
        distance_km REAL,       
        firebase_id TEXT,
        is_synced INTEGER DEFAULT 0
      );
    `);

    db.execSync(`
      CREATE TABLE IF NOT EXISTS gps_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id INTEGER,        
        latitude REAL,
        longitude REAL,
        speed REAL,             
        timestamp TEXT,
        firebase_id TEXT,
        is_synced INTEGER DEFAULT 0
      );
    `);

    db.execSync(`
      CREATE TABLE IF NOT EXISTS vehicle_alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id TEXT,
        alert_event TEXT,       
        severity_level TEXT,    
        detail TEXT,            
        timestamp TEXT,
        firebase_id TEXT,
        is_synced INTEGER DEFAULT 0
      );
    `);

    db.execSync(`
      CREATE TABLE IF NOT EXISTS driving_mode_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mode_name TEXT,         
        timestamp TEXT,
        firebase_id TEXT,
        is_synced INTEGER DEFAULT 0
      );
    `);

    db.execSync(`
      CREATE TABLE IF NOT EXISTS vehicle_status_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        battery_level INTEGER,  
        dte_km INTEGER,         
        last_updated TEXT
      );
    `);

    console.log("Database by NaiSyntaxSultan");
  } catch (error) {
    console.error("Error init DB:", error);
  }
};

// บันทึกข้อมูลผู้ใช้ลงเครื่อง
export const saveLocalUser = (studentData) => {
  const {
    student_id,
    fullname,
    emergency_phone,
    profile_image_uri,
    firebase_id,
  } = studentData;

  try {
    // ลบข้อมูลเก่าออกก่อน
    db.runSync("DELETE FROM user_profile");

    // บันทึกข้อมูลใหม่
    db.runSync(
      `INSERT INTO user_profile (student_id, fullname, emergency_phone, profile_image_uri, firebase_id, is_synced) 
       VALUES (?, ?, ?, ?, ?, 1)`,
      [
        student_id,
        fullname,
        emergency_phone,
        profile_image_uri || "",
        firebase_id,
      ],
    );
    console.log("User saved locally:", fullname);
    return true;
  } catch (error) {
    console.error("Save user error:", error);
    return false;
  }
};

// ดึงข้อมูลผู้ใช้ปัจจุบัน
export const getLocalUser = () => {
  try {
    const users = db.getAllSync("SELECT * FROM user_profile LIMIT 1");
    if (users.length > 0) {
      return users[0];
    }
    return null;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
};

// ออกจากระบบ
export const logoutLocalUser = () => {
  try {
    db.runSync("DELETE FROM user_profile");
    console.log("User logged out");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// อัปเดตข้อมูลส่วนตัว
export const updateLocalUserProfile = (fullname, emergencyPhone, imageUri) => {
  try {
    db.runSync(
      `UPDATE user_profile SET fullname = ?, emergency_phone = ?, profile_image_uri = ?, is_synced = 0`,
      [fullname, emergencyPhone, imageUri],
    );
    console.log("Profile updated locally");
  } catch (error) {
    console.error("Update profile error:", error);
  }
};
