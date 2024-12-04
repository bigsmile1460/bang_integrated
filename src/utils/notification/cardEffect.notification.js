import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../response/createResponse.js';
export const cardEffectNotification = (currentGame, useCardType, cardUsingUser) => {
  const responsePayload = {
    cardEffectNotification: {
      cardType: useCardType,
      userId: cardUsingUser.id,
      success: true,
    },
  };

  currentGame.users.forEach((user) => {
    user.socket.write(createResponse(PACKET_TYPE.CARD_EFFECT_NOTIFICATION, 0, responsePayload));
  });
};