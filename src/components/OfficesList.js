import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./OfficesList.css";
import { bookingsApi } from "../api";

export default function OfficesList({ offices = [], auth }) {
  const [index, setIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimes, setSelectedTimes] = useState([]);

  const qc = useQueryClient();

  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings"],
    queryFn: bookingsApi.getAll,
    initialData: [],
  });

  const bookMut = useMutation({
    mutationFn: bookingsApi.add,
    onSuccess: () => qc.invalidateQueries(["bookings"]),
  });

  if (!offices.length) return null;

  const next = () => setIndex((i) => (i + 1) % offices.length);
  const prev = () => setIndex((i) => (i - 1 + offices.length) % offices.length);
  const office = offices[index];

  const getBookedTimes = (roomId, date) =>
    bookings
      .filter((b) => b.roomId === roomId && b.date === date)
      .map((b) => b.time);

  const times = [
    "09:00 – 10:00", "10:00 – 11:00", "11:00 – 12:00", "12:00 – 13:00",
    "13:00 – 14:00", "14:00 – 15:00", "15:00 – 16:00", "16:00 – 17:00",
    "17:00 – 18:00"
  ];

  const toggleTime = (t) =>
    setSelectedTimes((prev) => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleBooking = async (room) => {
    if (!auth) return alert("Сначала войдите в систему!");
    if (!selectedDate || selectedTimes.length === 0) return alert("Выберите дату и хотя бы одно время!");

    try {
      for (const t of selectedTimes) {
        const booking = {
          id: "b_" + Date.now() + "_" + Math.random().toString(16).slice(2),
          userId: auth.id,
          officeId: office.id,
          roomId: room.id,
          date: selectedDate,
          time: t,
        };
        await bookMut.mutateAsync(booking);
      }
      alert("Бронирование успешно!");
      setSelectedRoom(null);
      setSelectedDate("");
      setSelectedTimes([]);
    } catch (err) {
      console.error(err);
      alert("Ошибка при бронировании");
    }
  };

  return (
    <div className="offices-section">
      <h3>Наши офисы</h3>

      <div className="carousel-wrapper">
        <button className="nav-btn prev" onClick={prev}>‹</button>
        <div className="office-card">
          <img src={office.img} alt={office.name} />
          <h4>{office.name}</h4>
          <p>{office.desc || "Современный офис с комфортными комнатами."}</p>
        </div>
        <button className="nav-btn next" onClick={next}>›</button>
      </div>

      <div className="room-list">
        {office.rooms.map((room) => (
          <div key={room.id} className="room-card">
            {room.img && <img src={room.img} alt={room.name} />}
            <h4>{room.name}</h4>
            <p>{room.shortDesc || "Уютная и функциональная комната для встреч."}</p>
            <button className="details-btn" onClick={() => setSelectedRoom(room)}>
              Подробнее
            </button>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div className="room-modal" onClick={() => setSelectedRoom(null)}>
          <div className="room-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setSelectedRoom(null)}>×</span>
            {selectedRoom.img && <img src={selectedRoom.img} alt={selectedRoom.name} />}
            <h3>{selectedRoom.name}</h3>
            <p>{selectedRoom.desc || "Комната идеально подходит для командной работы и встреч."}</p>

            <div className="booking-form">
              <label>Выберите дату:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTimes([]);
                }}
              />

              {selectedDate && (
                <>
                  <label>Выберите время:</label>
                  <div className="time-slots">
                    {times.map((t) => {
                      const booked = getBookedTimes(selectedRoom.id, selectedDate).includes(t);
                      const selected = selectedTimes.includes(t);
                      return (
                        <button
                          key={t}
                          disabled={booked}
                          className={`time-slot ${selected ? "selected" : ""} ${booked ? "booked" : ""}`}
                          onClick={() => toggleTime(t)}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              <button
                className="booking-btn"
                onClick={() => handleBooking(selectedRoom)}
                disabled={!selectedDate || selectedTimes.length === 0 || bookMut.isLoading}
              >
                {bookMut.isLoading ? "Бронирование..." : "Забронировать выбранное время"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
