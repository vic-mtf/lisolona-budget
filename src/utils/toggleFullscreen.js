export default function toggleFullscreen(el) {
  if (el && el.tagName) {
    if (!document.fullscreenElement) {
      el?.requestFullscreen()?.catch((err) => {
        alert(
          `Erreur lors de la tentative d'activation du mode plein écran: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  }
}
