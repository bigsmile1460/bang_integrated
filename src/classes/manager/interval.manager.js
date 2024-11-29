import { gameEndNotification } from '../../utils/notification/gameEnd.notification.js';
import { deadCheck } from '../../utils/notification/deadCheck.notification.js';
import { pinkCheck } from '../../utils/notification/pinkCheck.notification.js';

class IntervalManager {
  constructor() {
    if (IntervalManager.instance) {
      return IntervalManager.instance;
    }
    this.intervals = new Map();
    IntervalManager.instance = this;
  }

  // 이름 바꿔서 type을 활용해서 위치 동기화나 게임관련이나 이런곳에 써도 됨
  addPlayer(playerId, callback, interval, type = 'user') {
    if (!this.intervals.has(playerId)) {
      // 한 명의 유저가 여러개의 스케쥴을 관리할 수도 있음
      this.intervals.set(playerId, new Map());
    }

    this.intervals.get(playerId).set(type, setInterval(callback, interval));
  }

  addGame(gameId, callback, interval) {
    this.addPlayer(gameId, callback, interval, 'game');
  }

  // 따로 매니저로 빼도 됨
  addUpdatePosition() {
    this.addPlayer(playerId, callback, interval, 'updatePosition');
  }

  addGameEndNotification(room, interval = 3000) {
    const callback = () => {
      if (room.users.length === 0) {
        this.removeInterval(room.id, 'game')
      }
      console.log("interval 확인:",this.intervals.get(room.id))
      gameEndNotification(room)
    };
    this.addGame(room.id, callback, interval);
  }

  addDeathPlayer(room, interval = 1000) {
    const callback = () => deadCheck(room);
    this.addGame(room.id, callback, interval);
  }

  addHandCardCheck(room, interval = 1000) {
    const callback = () => pinkCheck(room);
    this.addGame(room.id, callback, interval)
  }
  

  removePlayer(playerId) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
      this.intervals.delete(playerId);
    }
  }

  removeInterval(playerId, type) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      if (userIntervals.has(type)) {
        clearInterval(userIntervals.get(type));
        userIntervals.delete(type);
      }
    }

  }

  clearAll() {
    this.intervals.forEach((userIntervals) => {
      userIntervals.forEach((intervalId) => {
        clearInterval(intervalId);
      });
    });

    this.intervals.clear();
  }
}

export const intervalManager = new IntervalManager();
Object.freeze(intervalManager);