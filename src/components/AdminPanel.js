import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi, bookingsApi, officesApi } from "../api";
import "./AdminPage.css";
import OfficeEditCard from "./OfficeEditCard";

export default function AdminPanel({ auth, onBack }) {
  const qc = useQueryClient();

  const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: usersApi.getAll });
  const { data: bookings = [] } = useQuery({ queryKey: ["bookings"], queryFn: bookingsApi.getAll });
  const { data: offices = [] } = useQuery({ queryKey: ["offices"], queryFn: officesApi.getAll });

  const updateOffice = useMutation({
    mutationFn: officesApi.update,
    onSuccess: () => qc.invalidateQueries(["offices"]),
  });

  const removeBooking = useMutation({
    mutationFn: bookingsApi.remove,
    onSuccess: () => qc.invalidateQueries(["bookings"]),
  });

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("users"); // users | offices

  if (!auth || auth.role !== "admin") {
    return (
      <div className="admin-page">
        <h2>Доступ запрещён</h2>
        <button onClick={onBack}>Назад</button>
      </div>
    );
  }

  // === Фильтр пользователей ===
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Админ-панель</h2>
        <button onClick={onBack}>← Назад</button>
      </div>

      <div className="admin-tabs">
        <button
          className={tab === "users" ? "active" : ""}
          onClick={() => setTab("users")}
        >
          Пользователи
        </button>
        <button
          className={tab === "offices" ? "active" : ""}
          onClick={() => setTab("offices")}
        >
          Офисы
        </button>
      </div>

      {tab === "users" && (
        <>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Поиск по имени или email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="user-list">
            {filteredUsers.map((u) => {
              const userBookings = bookings.filter((b) => b.userId === u.id);
              return (
                <div className="user-card" key={u.id}>
                  <div className="user-info">
                    <span>({u.email})</span>
                    <p className="role-tag">{u.role}</p>
                  </div>

                  <h4>Бронирования:</h4>
                  {userBookings.length === 0 ? (
                    <p className="no-bookings">Нет бронирований</p>
                  ) : (
                    <ul className="booking-list">
                      {userBookings.map((b) => {
                        const office = offices.find((o) => o.id === b.officeId);
                        const room = office?.rooms?.find((r) => r.id === b.roomId);
                                            
                        return (
                          <li key={b.id}>
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
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === "offices" && (
        <div className="offices-edit">
          {offices.map((o) => (
            <OfficeEditCard
              key={o.id}
              office={o}
              updateOffice={updateOffice}
              className="office-edit-card"
            />
          ))}
        </div>
      )}
    </div>
  );
}
