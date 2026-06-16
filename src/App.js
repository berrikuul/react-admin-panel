import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import OfficesList from "./components/OfficesList";
import AuthModal from "./components/AuthModal";
import ProfilePage from "./components/ProfilePage";
import AdminPanel from "./components/AdminPanel";
import {
  load,
  STORAGE_KEYS,
  bookingsApi,
  officesApi,
  OFFICES,
  initializeUsers,
} from "./api";


function App() {
  const qc = useQueryClient();
  const [showAuth, setShowAuth] = useState(false);
  const [, setShowBooking] = useState(false);
  const [, setOffice] = useState(null);
  const [, setRoom] = useState(null);
  const [activePage, setActivePage] = useState("main");
  const [auth, setAuth] = useState(load(STORAGE_KEYS.AUTH, null));

  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings"],
    queryFn: bookingsApi.getAll,
    initialData: [],
  });

  const { data: offices = [] } = useQuery({
    queryKey: ["offices"],
    queryFn: officesApi.getAll,
    initialData: OFFICES,
  });

  useEffect(() => {
    initializeUsers();
    
    if (!localStorage.getItem("rb_offices_v1")) {
      localStorage.setItem("rb_offices_v1", JSON.stringify(OFFICES));
    }
  
    qc.setQueryData(["auth"], auth);
  
    if (!auth) {
      setShowAuth(true);
    }
  }, [auth, qc]);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setAuth(null);
    setActivePage("main");
    setShowAuth(true);
  };

  const openBooking = (selectedOffice, selectedRoom) => {
    if (!auth) {
      setShowAuth(true);
      return;
    }
    setOffice(selectedOffice);
    setRoom(selectedRoom);
    setShowBooking(true);
  };

  const renderPage = () => {
  if (!auth) {
    return (
      <AuthModal
        show={true}
        onClose={() => {}}
        onLogin={(user) => setAuth(user)}
      />
    );
  }

  if (activePage === "admin") {
    if (auth.role !== "admin") return null;
    return <AdminPanel auth={auth} onBack={() => setActivePage("main")} />;
  }

  if (activePage === "profile") {
    return (
      <ProfilePage
        auth={auth}
        bookings={bookings}
        onBack={() => setActivePage("main")}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="layout">
      <div className="offices-scroll">
        <OfficesList onOpen={openBooking} offices={offices} auth={auth} />
      </div>
    </div>
  );
};

  return (
    <div className="app-root">
      <header>
        <h1>Сервис бронирования комнат</h1>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          {auth ? (
  <>
    {auth.role === "admin" && (
      <button onClick={() => setActivePage("admin")}>Админ-панель</button>
    )}
    <button onClick={() => setActivePage("profile")}>Личный кабинет</button>
    <button style={{ backgroundColor: "#e84118" }} onClick={handleLogout}>
      Выйти
    </button>
  </>
) : (
  <button onClick={() => setShowAuth(true)}>Вход</button>
)}
        </div>
      </header>

      <main>{renderPage()}</main>

      {showAuth && (
        <AuthModal
          show={true}
          onClose={() => {
            if (auth) setShowAuth(false);
          }}
          onLogin={(user) => {
            setAuth(user);
            setShowAuth(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
