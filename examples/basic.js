const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const rx = require('feathers-reactive');

const app = feathers()
  .configure(rx({
    idField: 'id'
  }))
  .use('/messages', memory());

const messages = app.service('messages');

messages.create({
  text: 'A test message'
}).then(() => {
  // Get a specific message with id 10. Emit the message data once it resolves
  // and every time it changes e.g. through an updated or patched event
  messages.watch().get(0).subscribe(message => console.log('My message', message));

  // Find all messages and emit a new list every time anything changes
  messages.watch().find().subscribe(messages => console.log('Message list', messages));

  setTimeout(() => {
    messages.create({ text: 'Another message' }).then(() =>
      setTimeout(() => messages.patch(0, { text: 'Updated message' }), 1000)
    );
  }, 1000);
});
