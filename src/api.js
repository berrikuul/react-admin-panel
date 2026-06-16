export const STORAGE_KEYS = {
  USERS: "rb_users_v1",
  BOOKINGS: "rb_bookings_v1",
  AUTH: "rb_auth_v1",
};

export function load(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export function validatePassword(pw) {
  return pw.length >= 6;
}

export const OFFICES = [
  {
    id: "o1",
    name: "Офис — Москва (Центр)",
    desc: "Современный офис в центре Москвы, рядом с метро и кафе.",
    img: "https://picsum.photos/seed/moscow/400/240",
    rooms: [
      { id: "r1", name: "Комната A", capacity: 4 },
      { id: "r2", name: "Комната B", capacity: 8 },
    ],
  },
  {
    id: "o2",
    name: "Офис — Санкт-Петербург",
    desc: "Современный офис с видом на Неву, рядом с метро и кафе.",
    img: "https://picsum.photos/seed/spb/400/240",
    rooms: [{ id: "r3", name: "Комната C", capacity: 6 }],
  },
  {
    id: "o3",
    name: "Офис — Новосибирск",
    desc: "Современный офис в центре Новосибирска, рядом с кафе и метро.",
    img: "https://picsum.photos/seed/novosib/400/240",
    rooms: [
      { id: "r4", name: "Комната D", capacity: 10 },
      { id: "r5", name: "Комната E", capacity: 2 },
    ],
  },
];

export const usersApi = {
  getAll: async () => load(STORAGE_KEYS.USERS, []),

  add: async (user) => {
    const all = load(STORAGE_KEYS.USERS, []);
    const newUser = {
      id: "u_" + Date.now(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: "user",
    };
    all.push(newUser);
    save(STORAGE_KEYS.USERS, all);
    return newUser;
  },

  update: async (user) => {
    const all = load(STORAGE_KEYS.USERS, []);
    const updated = all.map((u) => (u.id === user.id ? user : u));
    save(STORAGE_KEYS.USERS, updated);
    return user;
  },

  remove: async (id) => {
    const all = load(STORAGE_KEYS.USERS, []);
    const filtered = all.filter((u) => u.id !== id);
    save(STORAGE_KEYS.USERS, filtered);
    return id;
  },
};

export const bookingsApi = {
  getAll: async () => load(STORAGE_KEYS.BOOKINGS, []),

  add: async (booking) => {
    const all = load(STORAGE_KEYS.BOOKINGS, []);
    all.push(booking);
    save(STORAGE_KEYS.BOOKINGS, all);
    return booking;
  },

  remove: async (id) => {
    const all = load(STORAGE_KEYS.BOOKINGS, []);
    const filtered = all.filter((b) => b.id !== id);
    save(STORAGE_KEYS.BOOKINGS, filtered);
    return id;
  },

  update: async (booking) => {
    const all = load(STORAGE_KEYS.BOOKINGS, []);
    const updated = all.map((b) => (b.id === booking.id ? booking : b));
    save(STORAGE_KEYS.BOOKINGS, updated);
    return booking;
  },
};

export const officesApi = {
  getAll: async () => {
    return load("rb_offices_v1", OFFICES);
  },
  update: async (updatedOffice) => {
    const all = load("rb_offices_v1", OFFICES);
    const newList = all.map((o) => (o.id === updatedOffice.id ? updatedOffice : o));
    save("rb_offices_v1", newList);
    return updatedOffice;
  },
};
