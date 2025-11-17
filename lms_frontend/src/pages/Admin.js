import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Card } from "../components/widgets/Cards";
import { getAdminDataService } from "../services/adminStore";

/**
 * Admin page for managing Courses and Assignments.
 * - Admin only (route already role-guarded in App.js)
 * - Client-side validation
 * - Uses Supabase when configured (RLS-aware); falls back to mock local storage when not configured
 * - Lists to view created items
 * - Ocean Professional theme styles (using existing CSS tokens)
 */

// Helpers for inputs
function TextInput({ id, label, value, onChange, error, type = "text", required, placeholder }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label htmlFor={id} style={styles.label}>{label}{required ? " *" : ""}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
        placeholder={placeholder}
        required={required}
      />
      {error && <div style={styles.errorText}>{error}</div>}
    </div>
  );
}

function TextArea({ id, label, value, onChange, error, required, placeholder, rows = 3 }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label htmlFor={id} style={styles.label}>{label}{required ? " *" : ""}</label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...styles.textarea, ...(error ? styles.inputError : {}) }}
        placeholder={placeholder}
        rows={rows}
        required={required}
      />
      {error && <div style={styles.errorText}>{error}</div>}
    </div>
  );
}

function Select({ id, label, value, onChange, error, required, options }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label htmlFor={id} style={styles.label}>{label}{required ? " *" : ""}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
        required={required}
      >
        <option value="">Select...</option>
        {options.map((op) => (
          <option key={op.value} value={op.value}>{op.label}</option>
        ))}
      </select>
      {error && <div style={styles.errorText}>{error}</div>}
    </div>
  );
}

// PUBLIC_INTERFACE
export default function Admin() {
  /** Admin page with course and assignment management */
  const { user, signOut } = useAuth();
  const svc = useMemo(() => getAdminDataService(), []);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // Course form state
  const [courseForm, setCourseForm] = useState({
    title: "",
    code: "",
    instructor: "",
    startDate: "",
    endDate: "",
  });
  const [courseErrors, setCourseErrors] = useState({});
  const [courseSubmitting, setCourseSubmitting] = useState(false);

  // Assignment form state
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    courseCode: "",
    dueDate: "",
    points: "",
    description: "",
  });
  const [assignmentErrors, setAssignmentErrors] = useState({});
  const [assignmentSubmitting, setAssignmentSubmitting] = useState(false);

  // Load existing items
  useEffect(() => {
    let mounted = true;
    (async () => {
      const [c, a] = await Promise.all([svc.listCourses(), svc.listAssignments()]);
      if (!mounted) return;
      setCourses(c);
      setAssignments(a);
    })();
    return () => { mounted = false; };
  }, [svc]);

  // Client-side validation
  const validateCourse = () => {
    const e = {};
    if (!courseForm.title.trim()) e.title = "Title is required.";
    if (!courseForm.code.trim()) e.code = "Code is required.";
    if (!courseForm.instructor.trim()) e.instructor = "Instructor is required.";
    if (!courseForm.startDate) e.startDate = "Start date is required.";
    if (!courseForm.endDate) e.endDate = "End date is required.";
    if (courseForm.startDate && courseForm.endDate && new Date(courseForm.startDate) > new Date(courseForm.endDate)) {
      e.endDate = "End date must be after start date.";
    }
    return e;
  };

  const validateAssignment = () => {
    const e = {};
    if (!assignmentForm.title.trim()) e.title = "Title is required.";
    if (!assignmentForm.courseCode) e.courseCode = "Course is required.";
    if (!assignmentForm.dueDate) e.dueDate = "Due date is required.";
    const pts = Number(assignmentForm.points);
    if (!Number.isFinite(pts) || pts <= 0) e.points = "Points must be a positive number.";
    return e;
  };

  const onCreateCourse = async (e) => {
    e.preventDefault();
    const errs = validateCourse();
    setCourseErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      setCourseSubmitting(true);
      const created = await svc.createCourse(courseForm);
      setCourses((list) => [created, ...list]);
      setCourseForm({ title: "", code: "", instructor: "", startDate: "", endDate: "" });
      setCourseErrors({});
    } catch (err) {
      setCourseErrors(err?.details || { form: err?.message || "Unable to create course." });
    } finally {
      setCourseSubmitting(false);
    }
  };

  const onCreateAssignment = async (e) => {
    e.preventDefault();
    const errs = validateAssignment();
    setAssignmentErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      setAssignmentSubmitting(true);
      const created = await svc.createAssignment({
        ...assignmentForm,
        points: Number(assignmentForm.points),
      });
      setAssignments((list) => [created, ...list]);
      setAssignmentForm({ title: "", courseCode: "", dueDate: "", points: "", description: "" });
      setAssignmentErrors({});
    } catch (err) {
      setAssignmentErrors(err?.details || { form: err?.message || "Unable to create assignment." });
    } finally {
      setAssignmentSubmitting(false);
    }
  };

  const courseOptions = useMemo(
    () => courses.map((c) => ({ value: c.code, label: `${c.code} — ${c.title}` })),
    [courses]
  );

  const quickLinks = useMemo(() => ([
    { label: "Dashboard", href: "/dashboard" },
    { label: "Admin", href: "/admin" },
    { label: "Instructor", href: "/instructor" },
    { label: "Sign out", href: "#", onClick: (e) => { e.preventDefault(); signOut(); } },
  ]), [signOut]);

  return (
    <div className="app-grid">
      <Sidebar />
      <main className="content">
        <Header title="Admin" links={quickLinks} />
        <section className="dashboard-content">
          <div className="grid">
            <Card title="Create Course" subtitle="Add a new course to the catalog">
              {courseErrors.form && <div role="alert" style={styles.alert}>{courseErrors.form}</div>}
              <form onSubmit={onCreateCourse} noValidate>
                <TextInput id="c_title" label="Title" value={courseForm.title}
                  onChange={(v) => setCourseForm((f) => ({ ...f, title: v }))}
                  error={courseErrors.title} required placeholder="e.g., Calculus I" />
                <TextInput id="c_code" label="Code" value={courseForm.code}
                  onChange={(v) => setCourseForm((f) => ({ ...f, code: v }))}
                  error={courseErrors.code} required placeholder="e.g., MATH-101" />
                <TextInput id="c_instructor" label="Instructor" value={courseForm.instructor}
                  onChange={(v) => setCourseForm((f) => ({ ...f, instructor: v }))}
                  error={courseErrors.instructor} required placeholder="e.g., Dr. Newton" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <TextInput id="c_start" label="Start Date" type="date" value={courseForm.startDate}
                    onChange={(v) => setCourseForm((f) => ({ ...f, startDate: v }))}
                    error={courseErrors.startDate} required />
                  <TextInput id="c_end" label="End Date" type="date" value={courseForm.endDate}
                    onChange={(v) => setCourseForm((f) => ({ ...f, endDate: v }))}
                    error={courseErrors.endDate} required />
                </div>
                <button type="submit" className="btn" disabled={courseSubmitting}>
                  {courseSubmitting ? "Creating..." : "Create Course"}
                </button>
              </form>
            </Card>

            <Card title="Create Assignment" subtitle="Attach assignments to existing courses">
              {assignmentErrors.form && <div role="alert" style={styles.alert}>{assignmentErrors.form}</div>}
              <form onSubmit={onCreateAssignment} noValidate>
                <TextInput id="a_title" label="Title" value={assignmentForm.title}
                  onChange={(v) => setAssignmentForm((f) => ({ ...f, title: v }))}
                  error={assignmentErrors.title} required placeholder="e.g., Homework 1" />
                <Select id="a_course" label="Course" value={assignmentForm.courseCode}
                  onChange={(v) => setAssignmentForm((f) => ({ ...f, courseCode: v }))}
                  error={assignmentErrors.courseCode} required options={courseOptions} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <TextInput id="a_due" label="Due Date" type="date" value={assignmentForm.dueDate}
                    onChange={(v) => setAssignmentForm((f) => ({ ...f, dueDate: v }))}
                    error={assignmentErrors.dueDate} required />
                  <TextInput id="a_points" label="Points" type="number" value={assignmentForm.points}
                    onChange={(v) => setAssignmentForm((f) => ({ ...f, points: v }))}
                    error={assignmentErrors.points} required placeholder="e.g., 100" />
                </div>
                <TextArea id="a_desc" label="Description" value={assignmentForm.description}
                  onChange={(v) => setAssignmentForm((f) => ({ ...f, description: v }))}
                  error={assignmentErrors.description} placeholder="Optional details..." rows={3} />
                <button type="submit" className="btn" disabled={assignmentSubmitting || courseOptions.length === 0}>
                  {assignmentSubmitting ? "Creating..." : "Create Assignment"}
                </button>
              </form>
            </Card>

            <Card title="Courses" subtitle={`Total: ${courses.length}`}>
              <div className="vstack">
                {courses.length === 0 && <div className="empty">No courses created yet.</div>}
                {courses.length > 0 && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={styles.table} aria-label="Courses table">
                      <thead>
                        <tr>
                          <th style={styles.th}>Code</th>
                          <th style={styles.th}>Title</th>
                          <th style={styles.th}>Instructor</th>
                          <th style={styles.th}>Start</th>
                          <th style={styles.th}>End</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((c) => (
                          <tr key={c.id}>
                            <td style={styles.tdMono}>{c.code}</td>
                            <td style={styles.td}>{c.title}</td>
                            <td style={styles.td}>{c.instructor}</td>
                            <td style={styles.td}>{c.startDate}</td>
                            <td style={styles.td}>{c.endDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Assignments" subtitle={`Total: ${assignments.length}`}>
              <div className="vstack">
                {assignments.length === 0 && <div className="empty">No assignments created yet.</div>}
                {assignments.length > 0 && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={styles.table} aria-label="Assignments table">
                      <thead>
                        <tr>
                          <th style={styles.th}>Title</th>
                          <th style={styles.th}>Course</th>
                          <th style={styles.th}>Due</th>
                          <th style={styles.th}>Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignments.map((a) => (
                          <tr key={a.id}>
                            <td style={styles.td}>{a.title}</td>
                            <td style={styles.tdMono}>{a.courseCode}</td>
                            <td style={styles.td}>{a.dueDate}</td>
                            <td style={styles.td}>{a.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </section>
        <a className="feedback-tab" href="#feedback" aria-label="Feedback - Beta">Beta</a>
      </main>
    </div>
  );
}

const styles = {
  label: { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#374151" },
  input: { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 14, outline: "none", background: "#fff" },
  textarea: { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 14, outline: "none", background: "#fff", resize: "vertical" },
  inputError: { borderColor: "#EF4444" },
  errorText: { color: "#B91C1C", fontSize: 12, marginTop: 6 },
  alert: { background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA", padding: "8px 10px", borderRadius: 8, marginBottom: 12, fontSize: 13 },

  table: { width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 14, border: "1px solid var(--border-subtle)", borderRadius: 8, overflow: "hidden" },
  th: { textAlign: "left", padding: "10px 12px", background: "var(--surface-contrast)", color: "var(--text-secondary)", borderBottom: "1px solid var(--border-subtle)", whiteSpace: "nowrap" },
  td: { padding: "10px 12px", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-primary)" },
  tdMono: { padding: "10px 12px", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontFamily: "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace" },
};
