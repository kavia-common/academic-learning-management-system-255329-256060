"use strict";

/**
 * Mock data and lightweight services for dashboard.
 * Replace these with Supabase-backed implementations later.
 */

const today = new Date();
function addDays(n) {
  const d = new Date();
  d.setDate(today.getDate() + n);
  return d.toISOString().slice(0, 10);
}

// PUBLIC_INTERFACE
export function getEnrolledCourses(userId) {
  /** Returns a list of enrolled courses with progress metrics. */
  return Promise.resolve([
    { id: "c1", title: "Calculus I", instructor: "Dr. Newton", progress: 72, nextDue: addDays(2) },
    { id: "c2", title: "World History", instructor: "Prof. Curie", progress: 45, nextDue: addDays(4) },
    { id: "c3", title: "Intro to CS", instructor: "A. Turing", progress: 88, nextDue: addDays(1) },
  ]);
}

// PUBLIC_INTERFACE
export function getUpcomingDeadlines(userId) {
  /** Returns upcoming assignment/quiz deadlines. */
  return Promise.resolve([
    { id: "d1", course: "Calculus I", title: "Homework 3", dueDate: addDays(2) },
    { id: "d2", course: "Intro to CS", title: "Quiz: Arrays", dueDate: addDays(1) },
    { id: "d3", course: "World History", title: "Essay Outline", dueDate: addDays(5) },
  ]);
}

// PUBLIC_INTERFACE
export function getAnnouncements() {
  /** Returns announcements for the dashboard feed. */
  return Promise.resolve([
    { id: "a1", title: "Campus Wi-Fi Maintenance", body: "Brief downtime on Friday 2–4am.", date: addDays(0) },
    { id: "a2", title: "Library Hours Extended", body: "Open until 11pm during finals week.", date: addDays(3) },
  ]);
}
