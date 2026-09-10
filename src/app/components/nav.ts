export function goToSection(
  e: React.MouseEvent<HTMLAnchorElement>,
  id: string,
) {
  e.preventDefault();
  const el = id === "top" ? document.body : document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  window.location.href = id === "top" ? "/" : `/#${id}`;
}
