import { PACKET_TYPE } from '../constants/header.js';
import CustomError from '../utils/error/customError.js';
import getRoomListHandler from './room/getList.handler.js';
import { joinRandomRoomHandler, joinRoomHandler } from './room/joinRoom.handler.js';
import { loginHandler } from './user/login.handler.js';
import { registerHandler } from './user/register.handler.js';
import { createRoomHandler } from './room/createRoom.handler.js';
import { leaveRoomHandler } from './room/leaveRoom.handler.js';

const handlers = {
  // 회원가입 및 로그인
  [PACKET_TYPE.REGISTER_REQUEST]: { handler: registerHandler },
  [PACKET_TYPE.LOGIN_REQUEST]: { handler: loginHandler },
  [PACKET_TYPE.GET_ROOM_LIST_REQUEST]: { handler: getRoomListHandler },
  [PACKET_TYPE.CREATE_ROOM_REQUEST]: { handler: createRoomHandler },
  [PACKET_TYPE.JOIN_ROOM_REQUEST]: { handler: joinRoomHandler },
  [PACKET_TYPE.JOIN_RANDOM_ROOM_REQUEST]: { handler: joinRandomRoomHandler },
  [PACKET_TYPE.LEAVE_ROOM_REQUEST]: { handler: leaveRoomHandler },
  // [PACKET_TYPE.GAME_PREPARE_REQUEST]: { handler: gamePrepareHandler },
  // [PACKET_TYPE.GAME_START_REQUEST]: { handler: gameStartHandler },
  // [PACKET_TYPE.POSITION_UPDATE_REQUEST]: { handler: positionUpdateHandler },
  // [PACKET_TYPE.USE_CARD_REQUEST]: { handler: useCardHandler },
  // [PACKET_TYPE.GAME_START_REQUEST]: { handler: gameStartHandler },
  // [PACKET_TYPE.FLEA_MARKET_PICK_REQUEST]: { handler: fleaMarketPickHandler },
  // [PACKET_TYPE.GAME_START_REQUEST]: { handler: gameStartHandler },
  // [PACKET_TYPE.REACTION_REQUEST]: { handler: reactionHandler },
  // [PACKET_TYPE.DESTROY_CARD_REQUEST]: { handler: destroyCardHandler },
  // [PACKET_TYPE.CARD_SELECT_REQUEST]: { handler: cardSelectHandler },
  // [PACKET_TYPE.PASS_DEBUFF_REQUEST]: { handler: passDebuffHandler },
};

export const getHandlerByPacketType = (packetType) => {
  if (!handlers[packetType]) {
    throw new CustomError(`핸들러를 찾을 수 없음: ${packetType}`);
  }

  return handlers[packetType].handler;
};
