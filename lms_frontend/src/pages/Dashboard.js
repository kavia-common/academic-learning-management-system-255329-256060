import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Card } from "../components/widgets/Cards";
import { ProgressBar } from "../components/widgets/Progress";
import { getAnnouncements, getEnrolledCourses, getUpcomingDeadlines } from "../services/mockData";

/**
 * Student Dashboard page.
 * Uses Sidebar (fixed), Header with centered title and quick links, and a grid of cards:
 * - Enrolled Courses with progress bars
 * - Upcoming Deadlines list
 * - Announcements feed
 * Includes a floating feedback tab on the right with "Beta" label.
 */

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Student dashboard page implementation */
  const { user, signOut } = useAuth();
  const [courses, setCourses] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [c, d, a] = await Promise.all([
        getEnrolledCourses(user?.id),
        getUpcomingDeadlines(user?.id),
        getAnnouncements(),
      ]);
      if (!mounted) return;
      setCourses(c);
      setDeadlines(d);
      setAnnouncements(a);
    })();
    return () => { mounted = false; };
  }, [user?.id]);

  const quickLinks = useMemo(() => ([
    { label: "Dashboard", href: "/dashboard" },
    { label: "Admin", href: "/admin" },
    { label: "Instructor", href: "/instructor" },
    { label: "Courses", href: "/dashboard#courses" },
    { label: "Quizzes", href: "/dashboard#quizzes" },
    { label: "Sign in", href: "/signin" },
    { label: "Sign up", href: "/signup" },
  ]), []);

  return (
    <div className="app-grid">
      <Sidebar />
      <main className="content">
        <Header title="Home" links={quickLinks} />
        <section className="dashboard-content">
          <div className="grid">
            <Card title="Enrolled Courses" subtitle="Your current progress">
              <div className="vstack">
                {courses.map((c) => (
                  <div key={c.id} className="course-row">
                    <div className="course-meta">
                      <div className="course-title">{c.title}</div>
                      <div className="course-sub">Instructor: {c.instructor} • Next due: {c.nextDue}</div>
                    </div>
                    <ProgressBar label={`${c.title} completion`} value={c.progress} />
                  </div>
                ))}
                {courses.length === 0 && (
                  <div className="empty">No courses yet.</div>
                )}
              </div>
            </Card>

            <Card title="Upcoming Deadlines" subtitle="Stay on track">
              <ul className="list">
                {deadlines.map((d) => (
                  <li key={d.id} className="list-item">
                    <div className="li-title">{d.title}</div>
                    <div className="li-meta">{d.course} • Due {d.dueDate}</div>
                  </li>
                ))}
                {deadlines.length === 0 && <li className="empty">No upcoming deadlines.</li>}
              </ul>
            </Card>

            <Card title="Announcements" subtitle="Latest updates" footer={
              <div className="foot-actions">
                <button className="btn" onClick={signOut}>Sign out</button>
              </div>
            }>
              <div className="vstack">
                {announcements.map((a) => (
                  <article key={a.id} className="announcement">
                    <div className="ann-title">{a.title}</div>
                    <div className="ann-body">{a.body}</div>
                    <div className="ann-meta">{a.date}</div>
                  </article>
                ))}
                {announcements.length === 0 && <div className="empty">No announcements to show.</div>}
              </div>
            </Card>
          </div>
        </section>
        <a className="feedback-tab" href="#feedback" aria-label="Feedback - Beta">Beta</a>
      </main>
    </div>
  );
}
