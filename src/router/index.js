import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../shared/stores/auth";

/**
 * ROUTER SADAR-DOMAIN.
 * Satu build Vue melayani beberapa domain sekaligus; modul mana yang tampil
 * ditentukan dari hostname:
 *   rizky.com               -> landing + portfolio + dashboard (path-based)
 *   <slug>.rizky.com        -> modul invitation (subdomain tenant, Pola B)
 *   custom-domain.com       -> modul invitation (Pola C)
 */

// const CENTRAL_HOSTS = (import.meta.env.VITE_CENTRAL_HOSTS || 'rizky.test,localhost,127.0.0.1')
const CENTRAL_HOSTS = (
  import.meta.env.VITE_CENTRAL_HOSTS ||
  "rizky.test,localhost,127.0.0.1,192.168.0.107,192.168.0.84"
) //tambah host ip
  .split(",")
  .map((h) => h.trim());

function isCentralHost() {
  return CENTRAL_HOSTS.some(
    (h) =>
      location.hostname === h ||
      (location.hostname.endsWith(`.${h}`) === false &&
        location.hostname === h),
  );
}

// Route untuk domain utama
const centralRoutes = [
  {
    path: "/",
    name: "landing",
    component: () => import("../modules/landing/pages/Home.vue"),
  },
  {
    path: "/portfolio",
    name: "portfolio",
    component: () => import("../modules/portfolio/pages/PortfolioHome.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../modules/dashboard/pages/Login.vue"),
  },
  {
    path: "/dashboard",
    component: () => import("../modules/dashboard/layouts/DashboardLayout.vue"),
    meta: { auth: true },
    children: [
      {
        path: "",
        name: "dashboard.home",
        component: () => import("../modules/dashboard/pages/Beranda.vue"),
      },
      {
        path: "undangan",
        name: "dashboard.undangan",
        component: () => import("../modules/dashboard/pages/UndanganSaya.vue"),
      },
      {
        path: "edit",
        name: "dashboard.edit",
        component: () => import("../modules/dashboard/pages/EditUndangan.vue"),
      },
      {
        path: "tamu",
        name: "dashboard.tamu",
        component: () => import("../modules/dashboard/pages/Tamu.vue"),
      },
      {
        path: "acara",
        name: "dashboard.acara",
        component: () => import("../modules/dashboard/pages/Acara.vue"),
      },
      {
        path: "kisah-cinta",
        name: "dashboard.kisah-cinta",
        component: () => import("../modules/dashboard/pages/KisahCinta.vue"),
      },
      {
        path: "galeri",
        name: "dashboard.galeri",
        component: () => import("../modules/dashboard/pages/GaleriFoto.vue"),
      },
      {
        path: "kado",
        name: "dashboard.kado",
        component: () => import("../modules/dashboard/pages/KadoDigital.vue"),
      },
      {
        path: "rsvp",
        name: "dashboard.rsvp",
        component: () => import("../modules/dashboard/pages/Rsvp.vue"),
      },
      {
        path: "ucapan",
        name: "dashboard.ucapan",
        component: () => import("../modules/dashboard/pages/UcapanDoa.vue"),
      },
    ],
  },
  {
    path: "/agent",
    name: "agent",
    component: () =>
      import("../modules/agent-monitoring/pages/AgentDashboard.vue"),
    meta: { auth: true, admin: true },
  },
  // Preview undangan via path (untuk testing lokal tanpa subdomain)
  {
    path: "/i/:slug",
    name: "invitation.preview",
    component: () => import("../modules/invitation/pages/InvitationPublic.vue"),
  },
];

// Route saat diakses dari subdomain tenant / custom domain -> seluruh situs = undangan
const tenantRoutes = [
  {
    path: "/:slug?",
    name: "invitation.public",
    component: () => import("../modules/invitation/pages/InvitationPublic.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: isCentralHost() ? centralRoutes : tenantRoutes,
});

router.beforeEach(async (to) => {
  if (!to.meta.auth) return true;
  const auth = useAuthStore();
  if (!auth.loaded) await auth.fetchMe();
  if (!auth.isLoggedIn)
    return { name: "login", query: { redirect: to.fullPath } };
  if (to.meta.admin && !auth.isAdmin) return { name: "dashboard" };
  return true;
});

export default router;
