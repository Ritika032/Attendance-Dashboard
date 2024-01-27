import axios, { AxiosResponse } from "axios";

//LogIn
export const login = async (
  email: string,
  password: string
): Promise<AxiosResponse> => {
  try 
  {
    const hash = "dummy";
    const obj = { email, password, hash };
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);

    const config = { headers: { "Content-Type": "application/json" } };
    const something = await axios.post("/api/v1/login", obj, config);
    return something;
  } 
  catch (error: any) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Logout
export const logout = async (): Promise<AxiosResponse> => {
  try {
    const response = await axios.get("/api/v1/logout");

    return response;
  } catch (error: any) {
    console.error(
      "Logout failed:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

//Forgot Password
export const forgotPasssword = async (
  email: string
): Promise<AxiosResponse> => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const response = await axios.post("/password/forgot", { email }, config);

    return response.data;
  } catch (error: any) {
    console.log("Failed", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Get All students (Admin)
export const getAdminStudentsData = async (): Promise<
  AxiosResponse<
    {
      id: number;
      name: string;
      email: string;
      number: number;
      rollNumber: number;
    }[]
  >
> => {
  try {
    const response = await axios.get("api/v1/admin/students");

    return response;
  } catch (error: any) {
    console.error(
      "Failed to fetch students data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

//Get Attendance Counts (Admin)
export const getAdminCounts = async (): Promise<
  AxiosResponse<
    {
      totalStudentsCount: number;
      presentStudentsCount: number;
      absentStudentsCount: number;
    }[]
  >
> => {
  try {
    const response = await axios.get("/api/v1/admin/todaysCounts");
    return response;
  } catch (error: any) {
    console.error(
      "Failed to fetch counts data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
//Get attendnace by day (admin)
export const getAdminDate = async (date: string): Promise<
  AxiosResponse<{
    length: number;
    attendanceList: any[];
  }>
> => {
  try {
    const response = await axios.get(`/api/v1/admin/day?date=${date}`);
    return response;
  } catch (error: any) {
    console.error(
      "Failed to fetch admin/day data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

//QR Code
export const qrcodegenerator = async (): Promise<
  AxiosResponse<
    {
      text: string;
    }[]
  >
> => {
  try {
    const response = await axios.get("/api/v1/qr/get");

    return response;
  } catch (error: any) {
    console.error(
      "Failed to fetch counts data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

//Get attendnace Count (Student)
export const getMyCounts = async (): Promise<
  AxiosResponse<{
    totalAttendanceDays: number;
    presentDays: number;
    absentDays: number;
  }>
> => {
  try {
    const response = await axios.get("/api/v1/student/myCounts");
    console.log(response.data);
    return response;
  } catch (error: any) {
    console.error(
      "Failed to fetch my counts data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
//Check Attendance By Date
export const checkStudentPresence = async (
  studentId: string,
  date: string
): Promise<AxiosResponse<{ success: boolean; isPresent: boolean }>> => {
  try {
    const response = await axios.post('/api/v1/student/date', {
      student: studentId,
      date: date,
    });

    return response;
  } catch (error: any) {
    console.error(
      'Failed to check student presence:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};


// const deviceId = ${navigator.userAgent}-${navigator.platform}-${window.screen.width}x${window.screen.height};
//   const hash = crypto.createHash('sha256');
//   hash.update(deviceId);
//   const hashHex = hash.digest('hex');

// ye hashHex ko daal dena email or password ke sath