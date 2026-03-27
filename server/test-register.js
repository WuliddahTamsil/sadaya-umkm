import { registerUser } from './controllers/authController.js';

process.env.MONGODB_URI = 'mongodb+srv://aisyahputriharmelia_db_user:yKdIYy0mpArrJYyE@sadaya.dsjwntd.mongodb.net/sadaya?retryWrites=true&w=majority';

const req = {
  body: {
    name: 'ichatest',
    email: `ichatest+${Date.now()}@example.com`,
    password: 'Password1!',
    role: 'user',
    phone: '0812345678',
    address: 'Test',
    description: 'test'
  }
};

const res = {
  status(code) { this.code = code; return this; },
  json(obj) { console.log('status', this.code, obj); }
};

(async () => {
  try {
    await registerUser(req, res);
  } catch (error) {
    console.error('registerUser throw', error);
  }
})();
