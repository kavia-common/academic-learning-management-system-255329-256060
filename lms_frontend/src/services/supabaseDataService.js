import { getSupabase } from "../utils/supabaseClient";

/**
 * Supabase-backed data service for Courses and Assignments.
 * Note: Requires schema and RLS from assets/supabase.md and valid env vars.
 * Shapes results to match Admin.js UI: {id, code, title, instructor, startDate, endDate} and assignments accordingly.
 */
export const SupabaseAdminDataService = {
  async listCourses() {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("courses")
      .select("id, code, title, start_date, end_date, instructor_id")
      .order("created_at", { ascending: false });
    if (error) throw error;
    // Map to match current UI shape
    return (data || []).map((c) => ({
      id: c.id,
      code: c.code,
      title: c.title,
      instructor: c.instructor_id, // Pages may update to join profile name later
      startDate: c.start_date,
      endDate: c.end_date,
    }));
  },

  async createCourse(payload) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase not configured");
    const { title, code, instructor, startDate, endDate } = payload;
    const { data: user } = await supabase.auth.getUser();
    const instructorId = user?.user?.id;
    const { data, error } = await supabase
      .from("courses")
      .insert({
        title,
        code,
        instructor_id: instructorId,
        start_date: startDate,
        end_date: endDate,
      })
      .select("*")
      .single();
    if (error) throw error;
    return {
      id: data.id,
      title: data.title,
      code: data.code,
      instructor: instructor || instructorId,
      startDate: data.start_date,
      endDate: data.end_date,
    };
  },

  async listAssignments() {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("assignments")
      .select("id, course_id, title, due_date, points")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((a) => ({
      id: a.id,
      title: a.title,
      courseCode: a.course_id, // adapt in UI later to join course code
      dueDate: a.due_date,
      points: a.points,
    }));
  },

  async createAssignment(payload) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase not configured");
    const { title, courseCode, dueDate, points, description } = payload;
    // Find course by code (assuming unique)
    const { data: courses, error: cErr } = await supabase
      .from("courses")
      .select("id, code")
      .eq("code", courseCode)
      .limit(1);
    if (cErr) throw cErr;
    const course = courses?.[0];
    if (!course) {
      const err = new Error("Select a valid course.");
      err.details = { courseCode: "Select a valid course." };
      throw err;
    }
    const { data, error } = await supabase
      .from("assignments")
      .insert({
        course_id: course.id,
        title,
        description: description || null,
        due_date: dueDate,
        points: Number(points),
      })
      .select("*")
      .single();
    if (error) throw error;
    return {
      id: data.id,
      title: data.title,
      courseCode: courseCode,
      dueDate: data.due_date,
      points: data.points,
      description: data.description || "",
    };
  },
};
