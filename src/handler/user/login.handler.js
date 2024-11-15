import jwt from 'jsonwebtoken';
import { GlobalFailCode } from '../../init/loadProtos.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { findUserByEmail } from '../../db/user/user.db.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { config } from '../../config/config.js';
import bcrypt from 'bcrypt';
import { addUser } from '../../sessions/user.session.js';
import User from '../../classes/model/user.class.js';

export const loginHandler = async (socket, payload) => {
  const { email, password } = payload.loginRequest;
  console.log({ email, password });

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      const errorMessage = `${email}: 없는 email입니다.`;
      console.error(errorMessage);
      const errorResponse = {
        loginResponse: {
          success: false,
          message: errorMessage,
          token: '',
          myInfo: {},
          failCode: 3,
        },
      };

      socket.write(createResponse(PACKET_TYPE.LOGIN_RESPONSE, 0, errorResponse));
      return;
    }

    //패스워드 확인
    if (!(await bcrypt.compare(password, user.password))) {
      const errorMessage = '비밀번호가 틀렸습니다.';
      console.error(errorMessage);
      const errorResponse = {
        loginResponse: {
          success: false,
          message: errorMessage,
          token: '',
          myInfo: {},
          failCode: 3,
        },
      };

      socket.write(createResponse(PACKET_TYPE.LOGIN_RESPONSE, 0, errorResponse));
      return;
    }

    // 세션에 유저 추가
    const id = user.id;
    const nickname = user.nickname;
    const newUser = new User(id, nickname, socket);
    addUser(newUser);
    // TODO: 중복로그인 체크

    const token = jwt.sign({ id, password }, config.jwt.SCRET_KEY, { expiresIn: '1h' });
    const responsePayload = {
      loginResponse: {
        success: true,
        message: '로그인 성공',
        token: token,
        myInfo: { id: id, nickname: nickname, character: {} },
        failCode: 0,
      },
    };

    socket.write(createResponse(PACKET_TYPE.LOGIN_RESPONSE, 0, responsePayload));

  } catch (err) {
    console.error(`로그인 에러: ${err}`);
  }
};
