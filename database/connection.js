import MongoClient from 'mongoose';
import vm from 'v-response';

export default () => {
  MongoClient.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      vm.log('🚀 Connected to Database 🚀');
    })
    .catch((error) => console.error(error));
};
