type PropagationEvent = {
  stopPropagation: () => void;
};

export function activateWorldItem(
  event: PropagationEvent,
  activate: () => void,
) {
  event.stopPropagation();
  activate();
}
