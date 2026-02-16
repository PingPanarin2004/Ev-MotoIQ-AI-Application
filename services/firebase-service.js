import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../config/firebase-config";

const USERS_COLLECTION = "user_profile";
const TRIPS_COLLECTION = "trips";
const ALERTS_COLLECTION = "vehicle_alerts";
const DRIVING_LOGS_COLLECTION = "driving_mode_logs";

export const checkStudentOnFirebase = async (studentId) => {
  try {
    console.log(`กำลังค้นหาข้อมูลนักศึกษา: ${studentId} บน Firebase...`);

    const q = query(
      collection(firestore, USERS_COLLECTION),
      where("student_id", "==", studentId),
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      console.log("พบข้อมูลผู้ใช้:", userData.fullname);

      return {
        firebase_id: userDoc.id,
        ...userData,
      };
    } else {
      console.log("ไม่พบรหัสนักศึกษานี้ในระบบ");
      return null;
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเชื่อมต่อ Firebase:", error);
    return null;
  }
};

// แก้ไขข้อมูลส่วนตัว
export const updateCloudUser = async (firebaseId, updateData) => {
  try {
    if (!firebaseId) return;
    const userRef = doc(firestore, "user_profile", firebaseId);

    await updateDoc(userRef, {
      ...updateData,
      updatedAt: new Date(),
    });
    console.log("Cloud Profile Updated");
  } catch (error) {
    console.error("Cloud Update Error:", error);
  }
};

// ลบบัญชีถาวร
export const deleteCloudUser = async (firebaseId) => {
  try {
    if (!firebaseId) return;
    const userRef = doc(firestore, "user_profile", firebaseId);

    await deleteDoc(userRef);
    console.log("Cloud Account Deleted");
  } catch (error) {
    console.error("Cloud Delete Error:", error);
  }
};

// Trips
export const addCloudTrip = async (tripData) => {
  try {
    await addDoc(collection(firestore, TRIPS_COLLECTION), {
      ...tripData,
      syncedAt: new Date(),
    });
    console.log("Trip Saved to Cloud");
  } catch (error) {
    console.error("Trip Sync Error:", error);
  }
};

// Driving Mode Logs
export const addCloudDrivingLog = async (modeData) => {
  try {
    await addDoc(collection(firestore, DRIVING_LOGS_COLLECTION), {
      ...modeData,
      timestamp: new Date(),
    });
    console.log("Mode Logged");
  } catch (error) {
    console.error("Mode Log Error:", error);
  }
};

// Alerts
export const getCloudAlerts = async () => {
  try {
    const q = query(
      collection(firestore, ALERTS_COLLECTION),
      orderBy("timestamp", "desc"),
      limit(10),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Get Alerts Error:", error);
    return [];
  }
};
