import { shuffleCards, room, user, values, suits } from "./setting";

let tmp: any;
let rooms: room[] = [];
let newuser: user;

export const addUser = (username: string, roomname: string, sid: string) => {
  tmp = rooms.findIndex((r) => r.name === roomname);
  if (tmp !== -1 && rooms[tmp].users.length === 4) return -1;
  newuser = {
    id: sid,
    name: username,
    cards: [],
    room: roomname,
  };
  if (tmp === -1) {
    rooms.push({
      name: roomname,
      users: [newuser],
      trump: "",
      turn: -1,
      passes: 0,
      target: [-1, -1],
      tchoose: 0,
      round: [],
      scores: [0,0],
      suitofround: ""
    });
    return 1;
  } else rooms[tmp].users.push(newuser);
  return rooms[tmp].users.length;
};

export const startGame = (roomname: string) => {
  tmp = rooms.findIndex((r) => r.name === roomname);
  let allcards = shuffleCards();
  for (let i = 0; i < 52; ++i)
    rooms[tmp].users[i % 4].cards.push({
      suit: suits[Math.floor(allcards[i] / 13)],
      value: values[allcards[i] % 13],
    });
  rooms[tmp].turn = 0;
  return rooms[tmp].users;
};

export const trumpPlay = (
  trumpvalue: string,
  trumpsuit: string,
  pass: boolean,
  roomname: string
) => {
  tmp = rooms.findIndex((r) => r.name === roomname);
  if (!pass) {
    rooms[tmp].passes += 1;
    if (rooms[tmp].passes === 4) return -1;
  } else if (parseInt(trumpvalue) === 13) {
    rooms[tmp].trump = trumpsuit;
    rooms[tmp].target[rooms[tmp].turn % 2] = parseInt(trumpvalue);
    rooms[tmp].target[rooms[tmp].turn % 2 ^ 1] = 0;
    return -1;
  } else {
    rooms[tmp].trump = trumpsuit;
    rooms[tmp].passes = 0;
    rooms[tmp].target[rooms[tmp].turn % 2] = parseInt(trumpvalue);
    rooms[tmp].target[rooms[tmp].turn % 2 ^ 1] = 0;
  }
  rooms[tmp].turn = (rooms[tmp].turn + 1) % 4;
  return rooms[tmp].turn;
};

export const setTarget = (id: number, tar: number, roomname: string) => {
  tmp = rooms.findIndex((r) => r.name === roomname);
  rooms[tmp].target[id % 2] += tar;
  rooms[tmp].tchoose += 1;
  if (rooms[tmp].tchoose === 2) {
    if (rooms[tmp].target[id % 2] === 0) rooms[tmp].target[id % 2] = 1;
    if (rooms[tmp].target[id % 2] > 13) rooms[tmp].target[id % 2] = 13;
    return 1;
  }
  return 0;
};

export const getTrump = (roomname: string) => {
  tmp = rooms.findIndex((r) => r.name === roomname);
  return rooms[tmp].trump;
};

export const getTarget = (roomname: string) => {
  tmp = rooms.findIndex((r) => r.name === roomname);
  return rooms[tmp].target;
};

export const getUsers = (roomname: string) => {
  tmp = rooms.findIndex((r) => r.name === roomname);
  return rooms[tmp].users;
};

export const getTurn = (roomname: string) => {
  tmp = rooms.findIndex((r) => r.name === roomname);
  return rooms[tmp].turn;
};

export const updateRound = (
  room: string,
  id: number,
  val: string,
  suit: string
) => {
  tmp = rooms.findIndex((r) => r.name === room);
  let value = calculateVal(val);
  rooms[tmp].round.push({
    id: id + 1,
    value,
    suit,
  });
  if (rooms[tmp].round.length === 1) rooms[tmp].suitofround = suit 
  if (rooms[tmp].round.length === 4) return -1;
  else return (rooms[tmp].turn!+rooms[tmp].round.length!)%4;
};

const calculateVal = (val: string) => {
  if (val === "A") return "14";
  else if (val === "J") return "11";
  else if (val === "Q") return "12";
  else if (val === "K") return "13";
  else return val;
};

export const winner = (room: string) => {
  tmp = rooms.findIndex((r) => r.name === room);
  if (tmp === -1) throw new Error("");
  const trumpPlays = rooms[tmp].round.filter((r) => r.suit === rooms[tmp].trump);
  const suitPlays = rooms[tmp].round.filter((r) => r.suit === rooms[tmp].suitofround);
  let higgest: any;
  if (trumpPlays.length !== 0) {
    trumpPlays.sort((a, b) => parseInt(b.val) - parseInt(a.val));
    higgest = trumpPlays[0];
  } else {
    suitPlays.sort((a, b) => parseInt(b.val) - parseInt(a.val));
    higgest = suitPlays[0];
  }
  rooms[tmp].round = [];
  console.log(higgest.id)
  rooms[tmp].scores[higgest.id % 2] += 1
  if (higgest.id % 2) {
    return "TEAM 1";
  } else {
    return "TEAM 2";
  }
};
