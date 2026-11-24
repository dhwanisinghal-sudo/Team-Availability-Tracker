const teamList = document.getElementById("teamList");
const toast = document.getElementById("toast");
function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}
function initials(name) {
  return name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase();
}
function renderTeam(members) {
  const available = members.filter(member => Boolean(member.is_available)).length;
  document.getElementById("availableCount").textContent = available;
  document.getElementById("busyCount").textContent = members.length - available;
  document.getElementById("totalCount").textContent = members.length;
  if (!members.length) {
    teamList.innerHTML = '<div class="loading">No team members found.</div>';
    return;
  }
  teamList.innerHTML = members.map(member => {
    const yes = Boolean(member.is_available);
    return `<article class="team-row">
      <div class="member"><span class="member-avatar">${initials(member.name)}</span>
        <div><div class="member-name">${member.name}</div><div class="member-role">${member.role}</div></div>
      </div>
      <div class="status-cell"><span class="status-pill ${yes ? "available" : "busy"}"><i></i>${yes ? "AVAILABLE" : "BUSY"}</span>
        <button class="switch ${yes ? "on" : ""}" type="button" role="switch" aria-checked="${yes}"
          aria-label="Toggle availability for ${member.name}" data-id="${member.id}"></button>
      </div></article>`;
  }).join("");
}
async function loadTeam() {
  try {
    const response = await fetch("/api/team");
    if (!response.ok) throw new Error();
    renderTeam(await response.json());
  } catch {
    teamList.innerHTML = '<div class="loading">Unable to load team data. Refresh the page to try again.</div>';
  }
}
teamList.addEventListener("click", async event => {
  const button = event.target.closest(".switch");
  if (!button) return;
  const id = button.dataset.id;
  const current = button.getAttribute("aria-checked") === "true";
  button.disabled = true;
  try {
    const response = await fetch(`/api/team/${id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({is_available: !current})
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not update status.");
    await loadTeam();
    notify(`${result.name} is now ${result.is_available ? "available" : "busy"}.`);
  } catch (error) {
    button.disabled = false;
    notify(error.message);
  }
});
loadTeam();
