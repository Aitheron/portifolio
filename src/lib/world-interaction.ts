type PropagationEvent = {
  stopPropagation: () => void;
};

export function activateHtmlWorldControl(
  event: PropagationEvent,
  activate: () => void,
) {
  event.stopPropagation();
  activate();
}
