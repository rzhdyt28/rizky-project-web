import { ref, computed } from "vue";
import { api } from "@/shared/api/client";

export function usePortfolio() {
  const profile = ref(null);
  const skills = ref([]); // flat list dari API, dikelompokkan lewat skillEntries computed
  const experiences = ref([]);
  const educations = ref([]);
  const certifications = ref([]);

  const loading = ref(true);
  const error = ref(null);

  const contactStatus = ref("idle"); // idle | sending | success | error
  const contactError = ref(null);

  const lang = ref(
    (typeof localStorage !== "undefined" &&
      localStorage.getItem("portfolio-lang")) ||
      "id",
  );

  function setLang(next) {
    lang.value = next;
    if (typeof localStorage !== "undefined")
      localStorage.setItem("portfolio-lang", next);
  }

  function toggleLang() {
    setLang(lang.value === "id" ? "en" : "id");
  }

  // Helper bilingual: t({ id: '...', en: '...' }) -> string sesuai lang aktif
  function t(field) {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[lang.value] ?? field.id ?? field.en ?? "";
  }

  async function fetchPortfolio() {
    loading.value = true;
    error.value = null;
    try {
      // Bug fix: baseURL axios kosong ('') dan Vite proxy cuma nerusin
      // path yang diawali '/api' — jadi WAJIB pakai prefix '/api' di sini,
      // bukan cuma '/portfolio' (itu bakal 404 duluan di Vite, tidak
      // pernah sampai ke Laravel).
      const { data } = await api.get("/api/portfolio");
      profile.value = data.profile;
      skills.value = data.skills ?? [];
      experiences.value = data.experiences ?? [];
      educations.value = data.educations ?? [];
      certifications.value = data.certifications ?? [];
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  // form: { sender_name, sender_email, message, website } — `website` adalah
  // honeypot: input tersembunyi di UI, kalau keisi berarti bot -> tolak diam-diam
  // TANPA hit API sama sekali.
  async function submitContactMessage(form) {
    if (form.website) {
      contactStatus.value = "success";
      return;
    }

    contactStatus.value = "sending";
    contactError.value = null;
    try {
      await api.post("/api/portfolio/contact", {
        sender_name: form.sender_name,
        sender_email: form.sender_email,
        message: form.message,
      });
      contactStatus.value = "success";
    } catch (e) {
      contactStatus.value = "error";
      contactError.value = e?.response?.data?.message ?? null;
    }
  }

  function resetContactStatus() {
    contactStatus.value = "idle";
    contactError.value = null;
  }

  // Skills dari API berbentuk flat array [{ category, title, description, ... }, ...]
  // -> dikelompokkan di sini per category, urutan mengikuti urutan kemunculan
  // pertama tiap category di data asli (sudah di-orderBy('sort_order') dari backend).
  const skillEntries = computed(() => {
    const grouped = {};
    for (const s of skills.value) {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    }
    return Object.entries(grouped);
  });

  return {
    profile,
    skills,
    skillEntries,
    experiences,
    educations,
    certifications,
    loading,
    error,
    lang,
    setLang,
    toggleLang,
    t,
    fetchPortfolio,
    contactStatus,
    contactError,
    submitContactMessage,
    resetContactStatus,
  };
}

export function usePortfolioDocumentation() {
  const experiences = ref([]);
  const loading = ref(true);
  const error = ref(null);

  async function fetchDocumentation() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get("/api/portfolio/documentation");
      experiences.value = data.experiences ?? [];
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  return { experiences, loading, error, fetchDocumentation };
}
