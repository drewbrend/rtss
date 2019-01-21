import Test from './models/test';

export default function () {
  Test.count().exec((err, count) => {
    if (count > 0) {
      return;
    }

    const test1 = new Test({ name: 'Dummy Test 1', type: 'Cypress Test', isStable: true });
    const test2 = new Test({ name: 'Dummy Test 2', type: 'API Test', isStable: false });

    Test.create([test1, test2], (error) => {
      if (!error) {
        // eslint-disable-next-line no-console
        console.log('Test database seeded...');
      }
    });
  });
}
