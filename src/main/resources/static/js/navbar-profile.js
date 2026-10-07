document.addEventListener("DOMContentLoaded", () => {
  let activeUser = localStorage.getItem("loggedInUser");

  // Clear invalid stored user data
  if (activeUser === "[object HTMLInputElement]") {
    localStorage.removeItem("loggedInUser");
    activeUser = null;
  }

  const navLinksContainer = document.querySelector(
    ".nav-links, .main-nav, .course-nav, .course-nav-links"
  );

  if (!navLinksContainer) {
    return;
  }

  // Use absolute root paths to avoid 404/Whitelabel errors
  const profileUrl = "/profile.html";
  const homeUrl = "/index.html";

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
  profileLink.textContent = `👤 ${activeUser?.trim() || "Profile"}`;
  profileWrapper.appendChild(profileLink);

  if (activeUser?.trim()) {
    const loginBtn = navLinksContainer.querySelector(
      ".btn-nav-login, a[href*='login']"
    );
    const signupBtn = navLinksContainer.querySelector(
      ".btn-nav-signup:not(.navbar-profile-link), a[href*='signup']"
    );
    loginBtn?.remove();
    signupBtn?.remove();

    const logoutButton = document.createElement("button");
    logoutButton.type = "button";
    logoutButton.className = "navbar-profile-logout";
    logoutButton.textContent = "Logout";
    logoutButton.style.cssText =
      "background:none;border:0;color:#ef4444;padding:6px;cursor:pointer;font:600 14px 'Baloo 2',sans-serif;";
    
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      window.location.href = homeUrl;
    });

    profileWrapper.appendChild(logoutButton);
  }

  if (!existingProfile) {
    navLinksContainer.appendChild(profileWrapper);
  }
});