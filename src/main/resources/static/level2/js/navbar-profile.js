const navbarProfileScriptUrl = document.currentScript?.src || window.location.href;

document.addEventListener("DOMContentLoaded", () => {
  let activeUser = localStorage.getItem("loggedInUser");

  if (activeUser === "[object HTMLInputElement]") {
    localStorage.removeItem("loggedInUser");
    activeUser = null;
  }

  const navLinksContainer = document.querySelector(
    ".nav-links, .main-nav, .course-nav, .course-nav-links",
  );
  if (!navLinksContainer) return;

  const profileUrl = new URL("../../../profile.html", navbarProfileScriptUrl).href;
  const homeUrl = new URL("../../../index.html", navbarProfileScriptUrl).href;
  const existingProfile = navLinksContainer.querySelector(".navbar-profile");
  if (existingProfile?.dataset.profileReady === "true") return;

  const profileWrapper = existingProfile || document.createElement("div");
  profileWrapper.className = "navbar-profile";
  profileWrapper.dataset.profileReady = "true";
  profileWrapper.replaceChildren();
  profileWrapper.style.cssText =
    "display:inline-flex;align-items:center;gap:10px;margin-left:15px;";

  const profileLink = document.createElement("a");
  profileLink.href = profileUrl;
  profileLink.className = "btn-nav-signup navbar-profile-link";
  profileLink.style.cssText =
    "display:inline-flex;align-items:center;gap:7px;background:#eae6fa;color:#7f56da;border:1px solid #7f56da;padding:8px 16px;font:600 14px 'Baloo 2',sans-serif;text-decoration:none;border-radius:10px;white-space:nowrap;";
  profileLink.textContent = `\u{1F464} ${activeUser?.trim() || "Profile"}`;
  profileWrapper.appendChild(profileLink);

  if (activeUser?.trim()) {
    navLinksContainer.querySelector(".btn-nav-login, a[href*='login']")?.remove();
    navLinksContainer
      .querySelector(".btn-nav-signup:not(.navbar-profile-link), a[href*='signup']")
      ?.remove();
  }

  if (!existingProfile) {
    const logoutButton = navLinksContainer.querySelector(
      ".navbar-always-logout",
    );
    navLinksContainer.insertBefore(profileWrapper, logoutButton);
  }
});
