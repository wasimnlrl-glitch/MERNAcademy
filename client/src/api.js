async function request(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  health: () => request("/api/health"),
  modules: () => request("/api/modules"),
  lesson: (id) => request(`/api/lessons/${id}`),
  caseStudy: (moduleId) => request(`/api/case-studies/${moduleId}`),
  checkExercise: (lessonId, answers) =>
    request(`/api/exercises/${lessonId}/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    }),
  getProgress: () => request("/api/progress"),
  setProgress: (lessonId, status) =>
    request("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, status }),
    }),
};
