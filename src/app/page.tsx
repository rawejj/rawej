"use client";

import Image from "next/image";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Lee",
    specialty: "Cardiologist",
    rating: 4.9,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Expert in heart health and preventive care.",
  },
  {
    id: 2,
    name: "Dr. Ahmed Khan",
    specialty: "Dermatologist",
    rating: 4.8,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Specialist in skin, hair, and nail disorders.",
  },
  {
    id: 3,
    name: "Dr. Emily Chen",
    specialty: "Pediatrician",
    rating: 4.7,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    bio: "Caring for children’s health and development.",
  },
];

import { useState } from "react";

// Generate next 7 days
const getNext7Days = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      label: d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
      value: d.toISOString().slice(0, 10),
    });
  }
  return days;
};

const times = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30"
];

export type Doctor = typeof doctors[0];

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState(getNext7Days()[0].value);
  const [selectedTime, setSelectedTime] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const openModal = (doctor: typeof doctors[0]) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
    setSelectedDate(getNext7Days()[0].value);
    setSelectedTime("");
    setConfirmed(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
    setConfirmed(false);
  };

  const confirmBooking = () => {
    setConfirmed(true);
    setTimeout(() => {
      closeModal();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 font-sans">
      <header className="w-full py-6 px-4 flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-purple-700 dark:text-pink-400 tracking-tight">Find Your Doctor</h1>
        <Image src="/favicon.ico" alt="Logo" width={32} height={32} />
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="rounded-3xl bg-white dark:bg-zinc-800 shadow-lg p-6 flex flex-col items-center transition-transform hover:scale-[1.03] hover:shadow-2xl"
            >
              <Image
                src={doctor.image}
                alt={doctor.name}
                width={80}
                height={80}
                className="rounded-full border-4 border-purple-200 dark:border-pink-400 mb-4 shadow-md"
              />
              <h2 className="text-xl font-semibold text-purple-700 dark:text-pink-400 mb-1">{doctor.name}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-300 mb-2">{doctor.specialty}</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 mb-2">{doctor.bio}</p>
              <div className="flex items-center gap-1 mb-4">
                <span className="text-yellow-400">★</span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{doctor.rating}</span>
              </div>
              <button
                className="w-full py-2 px-4 rounded-full bg-linear-to-r from-purple-500 to-pink-400 text-white font-bold shadow-md hover:from-pink-400 hover:to-purple-500 transition-colors"
                onClick={() => openModal(doctor)}
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Booking Modal */}
      {showModal && selectedDoctor && (
        <div 
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-2xl animate-slide-up max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={selectedDoctor.image}
                alt={selectedDoctor.name}
                width={48}
                height={48}
                className="rounded-full border-2 border-purple-200 dark:border-pink-400"
              />
              <div>
                <div className="font-semibold text-lg text-purple-700 dark:text-pink-400">{selectedDoctor.name}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-300">{selectedDoctor.specialty}</div>
              </div>
            </div>
            <div className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">Select a date:</div>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 hide-scrollbar">
              {getNext7Days().map((day) => (
                <button
                  key={day.value}
                  className={`px-4 py-2 rounded-full border font-semibold transition-colors min-w-[90px] ${selectedDate === day.value ? "bg-purple-500 text-white border-purple-500" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700"}`}
                  onClick={() => setSelectedDate(day.value)}
                >
                  {day.label}
                </button>
              ))}
            </div>
            <div className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">Select a time:</div>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {times.map((time) => (
                <button
                  key={time}
                  className={`py-2 rounded-xl font-semibold transition-colors ${selectedTime === time ? "bg-pink-400 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200"}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
            <button
              className={`w-full py-3 rounded-full font-bold shadow-md transition-colors text-lg ${selectedTime ? "bg-linear-to-r from-purple-500 to-pink-400 text-white" : "bg-zinc-300 text-zinc-500 cursor-not-allowed"}`}
              onClick={selectedTime ? confirmBooking : undefined}
              disabled={!selectedTime}
            >
              {confirmed ? "Booked!" : "Confirm Booking"}
            </button>
            <button
              className="w-full mt-3 py-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-sm"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <footer className="w-full py-4 text-center text-xs text-zinc-400 dark:text-zinc-500 bg-white/60 dark:bg-zinc-900/60 mt-8 rounded-t-2xl shadow-inner">
        &copy; {new Date().getFullYear()} Doctor Booking App
      </footer>
      {/* Modal animation */}
      <style>{`
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(.4,2,.6,1) both; }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
