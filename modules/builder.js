import {
  ACTIONS,
  ACTIONS_TYPES,
  DURATION_MULTIPLIER_MS,
} from "../constants/index.js";

const buildBaseTracks = () =>
  ACTIONS_TYPES.map((actionType) => {
    return {
      type: actionType,
      actions: [],
    };
  });

export const buildGroupsByCharacter = ($) => {
  const trackGroups = [];
  $(".character").map((_, characterNode) => {
    const character = $(characterNode).text();
    const characterGroup = {
      target: character,
      tracks: buildBaseTracks(),
    };
    if (!trackGroups.some((group) => group.target === character))
      trackGroups.push(characterGroup);
  });
  return trackGroups;
};

export const buildActions = ($, trackGroup) => {
  let timestamp = 0;
  const trackGroupCopy = JSON.parse(JSON.stringify(trackGroup));

  $(".character").map((_, characterNode) => {
    const character = $(characterNode).text();
    let nextNode = $(characterNode).next();

    while (nextNode.hasClass("dialog")) {
      const characterGroup = trackGroupCopy.find(
        (group) => group.target === character
      );
      const characterDialogTrack = characterGroup.tracks.find(
        (track) => track.type === ACTIONS["dialog"]
      );

      const charsUntilAction = nextNode.html().indexOf("<span");

      if (charsUntilAction >= 0) {
        const actionTimestamp =
          timestamp + charsUntilAction * DURATION_MULTIPLIER_MS;
        nextNode.children("span").map((_, spanElement) => {
          const element = $(spanElement);
          const actionType = element.data("actionType");
          const track = characterGroup.tracks.find(
            (track) => track.type === actionType
          );

          track.actions.push({
            actionId: element.data("actionId"),
            actionType: element.data("actionType"),
            timestamp: actionTimestamp,
            target: element.data("actionTarget"),
          });
        });
      }

      nextNode.children("span").remove();
      const duration = nextNode.text().length * DURATION_MULTIPLIER_MS;
      characterDialogTrack.actions.push({
        dialog: nextNode.text(),
        timestamp,
        duration: duration,
      });
      timestamp += duration;
      nextNode = nextNode.next();
    }
  });

  return {
    trackGroups: trackGroupCopy,
  };
};
