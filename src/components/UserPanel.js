import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingsApi, STORAGE_KEYS } from "../api";

export default function UserPanel({ auth, onLogout }) {
  const qc = useQueryClient();
  const bookingsQ = useQuery({
    queryKey: ["bookings"],
    queryFn: bookingsApi.getAll,
    initialData: [],
  });

  if (!auth) return null;

  const myBookings = bookingsQ.data.filter((b) => b.userId === auth.id);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    qc.setQueryData(["auth"], null);
    onLogout?.();
  };

  return (
    <div className="user-panel">
      <div>
        Привет, <b>{auth?.name}</b>
      </div>
      <button onClick={handleLogout}>Выйти</button>
      <h4>Мои брони</h4>
      {myBookings.length === 0 ? (
        <div>Нет бронирований</div>
      ) : (
        <ul>
          {myBookings.map((b) => (
            <li key={b.id}>
              {b.officeName} — {b.roomName} — {b.date} {b.time} ({b.duration}ч)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
