import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: '283448189',
    password: '123456',
    name: 'NickXu'
  }
];

const Rooms = [];

for (let i = 0; i < 10; i++) {
  Rooms.push(Mock.mock({
    id: Mock.Random.id(),
    name: Mock.Random.cname(),
    addr: Mock.Random.name(),
    'age|18-60': 1,
    birth: Mock.Random.date(),
    sex: Mock.Random.integer(0, 1)
  }));
}

export { LoginUsers, Rooms };