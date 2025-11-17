"use strict";

/**
 * Admin data services for Courses and Assignments.
 * Returns a Supabase-backed service when Supabase env is configured, otherwise falls back to mock.
 */

import { SupabaseAdminDataService } from "./supabaseDataService";

const LS_KEYS = {
  courses: "lms.admin.courses.v1",
  assignments: "lms.admin.assignments.v1",
};

let _courses = [];
let _assignments = [];

// Initialize from localStorage (best-effort)
(function init() {
  try {
    const c = JSON.parse(window.localStorage.getItem(LS_KEYS.courses) || "[]");
    const a = JSON.parse(window.localStorage.getItem(LS_KEYS.assignments) || "[]");
    if (Array.isArray(c)) _courses = c;
    if (Array.isArray(a)) _assignments = a;
  } catch {
    // ignore
  }
})();

function persist() {
  try {
    window.localStorage.setItem(LS_KEYS.courses, JSON.stringify(_courses));
    window.localStorage.setItem(LS_KEYS.assignments, JSON.stringify(_assignments));
  } catch {
    // ignore storage errors in mock mode
  }
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
}

// Detect supabase readiness lazily to avoid importing auth service here (prevent cycles)
function supabaseReady() {
  return Boolean(process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY);
}

// PUBLIC_INTERFACE
export function getAdminDataService() {
  /**
   * Factory for the admin data service.
   * If Supabase is configured, return SupabaseAdminDataService, else MockAdminDataService.
   */
  if (supabaseReady()) return SupabaseAdminDataService;
  return MockAdminDataService;
}

// PUBLIC_INTERFACE
export const MockAdminDataService = {
  /** Course APIs */

  // PUBLIC_INTERFACE
  async listCourses() {
    /**
     * List all created courses.
     * @returns {Promise<Array<{id:string, title:string, code:string, instructor:string, startDate:string, endDate:string}>>}
     */
    return [..._courses];
  },

  // PUBLIC_INTERFACE
  async createCourse(payload) {
    /**
     * Create a new course with basic validation.
     * @param {Object} payload
     * @param {string} payload.title
     * @param {string} payload.code
     * @param {string} payload.instructor
     * @param {string} payload.startDate - ISO yyyy-mm-dd
     * @param {string} payload.endDate - ISO yyyy-mm-dd
     * @returns {Promise<Object>} created course
     * @throws Error when validation fails
     */
    const errors = {};
    const title = (payload?.title || "").trim();
    const code = (payload?.code || "").trim();
    const instructor = (payload?.instructor || "").trim();
    const startDate = (payload?.startDate || "").trim();
    const endDate = (payload?.endDate || "").trim();

    if (!title) errors.title = "Title is required.";
    if (!code) errors.code = "Code is required.";
    if (!instructor) errors.instructor = "Instructor is required.";
    if (!startDate) errors.startDate = "Start date is required.";
    if (!endDate) errors.endDate = "End date is required.";
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errors.dateRange = "Start date must be before end date.";
    }
    if (code && _courses.some((c) => c.code.toLowerCase() === code.toLowerCase())) {
      errors.code = "A course with this code already exists.";
    }
    if (Object.keys(errors).length) {
      const err = new Error("Validation failed");
      err.details = errors;
      throw err;
    }

    const course = {
      id: uid("course"),
      title,
      code,
      instructor,
      startDate,
      endDate,
      createdAt: new Date().toISOString(),
    };
    _courses.unshift(course);
    persist();
    return course;
  },

  /** Assignment APIs */

  // PUBLIC_INTERFACE
  async listAssignments() {
    /**
     * List all created assignments.
     * @returns {Promise<Array<{id:string, title:string, courseCode:string, dueDate:string, points:number, description:string}>>}
     */
    return [..._assignments];
  },

  // PUBLIC_INTERFACE
  async createAssignment(payload) {
    /**
     * Create a new assignment with basic validation.
     * @param {Object} payload
     * @param {string} payload.title
     * @param {string} payload.courseCode - must match an existing course code
     * @param {string} payload.dueDate - ISO yyyy-mm-dd
     * @param {number|string} payload.points
     * @param {string} [payload.description]
     * @returns {Promise<Object>} created assignment
     * @throws Error when validation fails
     */
    const errors = {};
    const title = (payload?.title || "").trim();
    const courseCode = (payload?.courseCode || "").trim();
    const dueDate = (payload?.dueDate || "").trim();
    const pointsNum = Number(payload?.points ?? 0);
    const description = (payload?.description || "").trim();

    if (!title) errors.title = "Title is required.";
    if (!courseCode) errors.courseCode = "Course is required.";
    if (courseCode && !_courses.some((c) => c.code === courseCode)) {
      errors.courseCode = "Select a valid course.";
    }
    if (!dueDate) errors.dueDate = "Due date is required.";
    if (!Number.isFinite(pointsNum) || pointsNum <= 0) {
      errors.points = "Points must be a positive number.";
    }
    if (Object.keys(errors).length) {
      const err = new Error("Validation failed");
      err.details = errors;
      throw err;
    }

    const assignment = {
      id: uid("assign"),
      title,
      courseCode,
      dueDate,
      points: Math.round(pointsNum),
      description,
      createdAt: new Date().toISOString(),
    };
    _assignments.unshift(assignment);
    persist();
    return assignment;
  },
};
