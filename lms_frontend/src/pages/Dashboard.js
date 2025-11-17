import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Card } from "../components/widgets/Cards";
import { ProgressBar } from "../components/widgets/Progress";
import { getAnnouncements, getEnrolledCourses, getUpcomingDeadlines } from "../services/mockData";
import { supabase } from "../utils/supabaseClient";

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
      const supaReady = Boolean(process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY);
      if (supaReady && user?.id) {
        try {
          // Courses: public.courses (anyone can read) + join instructor later; show minimal fields
          const { data: cData, error: cErr } = await supabase
            .from("courses")
            .select("id, title, code, start_date, end_date, instructor_id")
            .order("created_at", { ascending: false })
            .limit(10);
          if (cErr) throw cErr;
          const coursesShaped = (cData || []).map((c) => ({
            id: c.id,
            title: c.title,
            instructor: c.instructor_id?.slice(0, 8) || "Instructor",
            progress: Math.floor(Math.random() * 50) + 40, // placeholder until progress implemented
            nextDue: c.end_date || "",
          }));

          // Deadlines: assignments for enrolled courses (via policy) or public view if created; fallback none
          const { data: aData, error: aErr } = await supabase
            .from("course_assignments")
            .select("id, title, course_code, due_date")
            .order("due_date", { ascending: true })
            .limit(10);
          // If view not available due to setup, ignore error and fallback to empty
          const deadlinesShaped =
            aErr || !aData
              ? []
              : aData.map((d) => ({ id: d.id, course: d.course_code, title: d.title, dueDate: d.due_date }));

          // Announcements: none in schema; keep mock for now
          const anns = await getAnnouncements();

          if (!mounted) return;
          setCourses(coursesShaped);
          setDeadlines(deadlinesShaped);
          setAnnouncements(anns);
          return;
        } catch {
          // fall back to mock if any error (e.g., RLS not yet configured)
        }
      }

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
    return () => {
      mounted = false;
    };
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
