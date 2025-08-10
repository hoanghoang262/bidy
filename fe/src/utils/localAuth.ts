export interface LocalUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  news?: boolean;
}

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

export function registerUser(user: LocalUser): { success: boolean; error?: string } {
  if (!user.name || !user.email || !user.phone || !user.password) {
    return { success: false, error: "Vui lòng điền đầy đủ thông tin bắt buộc." };
  }
  const users: LocalUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  if (users.some(u => u.email === user.email || u.phone === user.phone)) {
    return { success: false, error: "Email hoặc số điện thoại đã được đăng ký." };
  }
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true };
}

export function authenticateUser(email: string, password: string): { success: boolean; user?: LocalUser; error?: string } {
  const users: LocalUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return { success: false, error: "Email hoặc mật khẩu không đúng." };
  }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return { success: true, user };
}

export function getCurrentUser(): LocalUser | null {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
} 