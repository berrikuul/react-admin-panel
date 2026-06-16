import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsApi, officesApi } from "../api";
import "./ProfilePage.css";

export default function ProfilePage({ auth, onBack }) {
  const qc = useQueryClient();

  // Получаем брони и офисы
  const { data: bookings = [] } = useQuery({ queryKey: ["bookings"], queryFn: bookingsApi.getAll });
  const { data: offices = [] } = useQuery({ queryKey: ["offices"], queryFn: officesApi.getAll });

  // Мутация для удаления брони
  const removeBooking = useMutation({
    mutationFn: bookingsApi.remove,
    onSuccess: () => qc.invalidateQueries(["bookings"]),
  });

  if (!auth) {
    return (
      <div className="profile-page">
        <h2>Доступ запрещён</h2>
        <button className="back-btn" onClick={onBack}>← Назад</button>
      </div>
    );
  }

  const userBookings = bookings.filter(b => b.userId === auth.id);

  return (
    <div className="profile-page">
      <h2>Мои бронирования</h2>

      <div className="user-info">
        <label>Email:</label>
        <div className="email-display">{auth.email}</div>
      </div>

      {userBookings.length === 0 ? (
        <p className="no-bookings">Нет бронирований</p>
      ) : (
        <ul className="bookings-list">
          {userBookings.map((b) => {
            const office = offices.find(o => o.id === b.officeId);
            const room = office?.rooms?.find(r => r.id === b.roomId);

            return (
              <li key={b.id} className="booking-item">
                <div>
                  {office ? office.name : "Неизвестный офис"} — {room ? room.name : "Неизвестная комната"}
                  <br />
                  {b.date}, {b.time} ({b.duration}ч)
                </div>
                <button
                  className="delete-btn"
                  onClick={() => removeBooking.mutate(b.id)}
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="footer-buttons">
        <button className="back-btn" onClick={onBack}>← Назад</button>
      </div>
    </div>
  );
}
