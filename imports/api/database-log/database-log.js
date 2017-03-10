import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const DatabaseLog = new Mongo.Collection('databaseLog');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish experiments to users that are logged in
  // TODO: restrict log events sent to client according to permissions
  Meteor.publish('DatabaseLog', function sequencersPublication() {
  	return (DatabaseLog.find());
  })
}

Meteor.methods({
  'databaseLog.insert'(userId, action, objectIds, collection, newValues) {
    // console.log('DatabaseLog.insert');
    // console.log('userId: ' + userId);
    // console.log('action: ' + action);
    // console.log('objectIds: ' + objectIds);
    // console.log('collection: ' + collection);
    // console.log('newValues: ' + newValues);
    // only the server itself is allowed to add entries in the log
    // https://github.com/themeteorchef/server-only-methods/blob/master/README.md says that:
    // (this.connection == null) when this method is called on the server
    // However, it seems to be the opposite (this.connection != null) in the server
    // console.log(this.connection);
    if (this.connection != null) {
      // console.log('server side');
      check(userId, String);
      check(action, String);
      check(objectIds, Array);
      check(collection, String);
      check(newValues, Object);

      if (userId !== this.userId) {
        throw new Meteor.Error('databaseLog.insert.unauthorized',
          'userId supplied does not match this.userId');
      }
      // console.log('userId confirmed');
   
      DatabaseLog.insert({
        userId: this.userId,
        action: action,
        objectIds: objectIds,
        collection: collection,
        newValues: newValues,
      }, (err, res) => {
        if (err){
          // TODO: consider log rotation
          console.log(err);
        }
      });
    }

    // TODO: update method
    
  },

});
